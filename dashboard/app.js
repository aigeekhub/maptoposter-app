/* ==========================================================================
   MapPoster Studio - Interactive JS Application (Epic Award-Winning UX)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // UI State
    let activeThemeId = "terracotta";
    let systemThemes = [];
    let currentLogsText = "";

    // DOM Elements Bindings
    const form = document.getElementById("poster-form");
    const inputCity = document.getElementById("input-city");
    const inputCountry = document.getElementById("input-country");
    const inputDistance = document.getElementById("input-distance");
    const distanceValue = document.getElementById("distance-value");
    
    // Advanced options
    const inputLat = document.getElementById("input-lat");
    const inputLong = document.getElementById("input-long");
    const inputDisplayCity = document.getElementById("input-display-city");
    const inputDisplayCountry = document.getElementById("input-display-country");
    const inputFontFamily = document.getElementById("input-font-family");
    const inputCountryLabel = document.getElementById("input-country-label");
    
    // Formats & Dimensions
    const inputWidth = document.getElementById("input-width");
    const inputHeight = document.getElementById("input-height");
    const inputFormat = document.getElementById("input-format");
    
    // Grid elements & buttons
    const themesGrid = document.getElementById("themes-grid");
    const btnGenerate = document.getElementById("btn-generate");
    
    // Preview panel
    const posterPreview = document.getElementById("poster-preview");
    const scannerOverlay = document.getElementById("scanner-overlay");
    const progressStatus = document.getElementById("progress-status");
    const resultsActions = document.getElementById("results-actions");
    const fileNameDisplay = document.getElementById("file-name");
    const btnDownload = document.getElementById("btn-download");
    const btnInspect = document.getElementById("btn-inspect");
    
    // Gallery & Logs
    const galleryGrid = document.getElementById("gallery-grid");
    const galleryCount = document.getElementById("gallery-count");
    const logsDrawerOverlay = document.getElementById("logs-drawer-overlay");
    const logsConsole = document.getElementById("logs-console");
    const btnCloseLogs = document.getElementById("btn-close-logs");

    /* ==========================================================================
       1. Core Initialization Tasks
       ========================================================================== */

    // Form inputs change/input handlers
    inputDistance.addEventListener("input", (e) => {
        const val = parseInt(e.target.value).toLocaleString();
        distanceValue.textContent = `${val} meters`;
    });

    // Enforce limits on width and height
    const enforceInputMax = (el, max) => {
        el.addEventListener("change", () => {
            if (parseFloat(el.value) > max) {
                el.value = max;
                showNotification(`Maximum size limit is ${max} inches.`, "info");
            }
        });
    };
    enforceInputMax(inputWidth, 20);
    enforceInputMax(inputHeight, 20);

    // Fetch themes and recent posters
    fetchThemes();
    fetchRecentPosters();

    /* ==========================================================================
       2. API Request Functions
       ========================================================================== */

    // Fetch all themes dynamically
    async function fetchThemes() {
        try {
            const response = await fetch("/api/themes");
            if (!response.ok) throw new Error("Failed to load themes.");
            
            systemThemes = await response.json();
            renderThemesGrid(systemThemes);
        } catch (error) {
            console.error("Themes fetch error:", error);
            themesGrid.innerHTML = `<div class="gallery-empty">Failed to load styles. Server might be offline.</div>`;
        }
    }

    // Render theme selectors dynamically
    function renderThemesGrid(themes) {
        themesGrid.innerHTML = "";
        if (themes.length === 0) {
            themesGrid.innerHTML = `<div class="gallery-empty">No styles found. Check themes directory!</div>`;
            return;
        }

        themes.forEach((theme) => {
            const card = document.createElement("div");
            card.className = `theme-card ${theme.id === activeThemeId ? "active" : ""}`;
            card.dataset.id = theme.id;

            card.innerHTML = `
                <div class="theme-preview-bubble">
                    <div class="theme-bubble-split">
                        <div class="bubble-bg" style="background-color: ${theme.bg}"></div>
                        <div class="bubble-accent" style="background-color: ${theme.road_primary}"></div>
                    </div>
                </div>
                <div class="theme-card-info">
                    <span class="theme-card-title">${theme.name}</span>
                    <span class="theme-card-desc">${theme.description}</span>
                </div>
            `;

            card.addEventListener("click", () => {
                document.querySelectorAll(".theme-card").forEach(c => c.classList.remove("active"));
                card.classList.add("active");
                activeThemeId = theme.id;
                updateAccentThemeColor(theme);
            });

            themesGrid.appendChild(card);
        });

        // Set initial theme accent colors
        const initialTheme = themes.find(t => t.id === activeThemeId);
        if (initialTheme) updateAccentThemeColor(initialTheme);
    }

    // Dynamically update UI accents based on selected theme
    function updateAccentThemeColor(theme) {
        document.documentElement.style.setProperty("--accent", theme.road_primary === "#ffffff" ? "#ef4444" : theme.road_primary);
        document.documentElement.style.setProperty("--accent-glow", `${theme.bg}40`);
    }

    // Fetch recently generated posters
    async function fetchRecentPosters() {
        try {
            const response = await fetch("/api/recent");
            if (!response.ok) throw new Error("Failed to load posters.");
            
            const posters = await response.json();
            renderRecentPosters(posters);
        } catch (error) {
            console.error("Posters fetch error:", error);
        }
    }

    // Render recently generated posters in the carousel
    function renderRecentPosters(posters) {
        galleryGrid.innerHTML = "";
        galleryCount.textContent = `${posters.length} poster${posters.length === 1 ? "" : "s"} saved`;

        if (posters.length === 0) {
            galleryGrid.innerHTML = `<div class="gallery-empty">No local posters detected yet. Generated posters will appear here!</div>`;
            return;
        }

        posters.forEach((poster) => {
            const item = document.createElement("div");
            item.className = "gallery-item";
            
            // Generate clean display name (e.g., paris (warm_beige))
            const parts = poster.name.split("_");
            const cityDisplay = parts[0].replace(/_/g, " ");

            item.innerHTML = `
                <div class="gallery-item-frame">
                    <img src="${poster.path}" alt="${poster.name}" class="gallery-item-img" loading="lazy">
                </div>
                <span class="gallery-item-title">${cityDisplay}</span>
            `;

            item.addEventListener("click", () => {
                loadPosterToPreview(poster);
            });

            galleryGrid.appendChild(item);
        });
    }

    // Display a previously generated poster instantly in the mock frame
    function loadPosterToPreview(poster) {
        posterPreview.innerHTML = `
            <img src="${poster.path}" alt="${poster.name}" class="poster-img" style="opacity: 0; transition: opacity 0.5s ease;">
        `;
        
        // Trigger subtle fade-in transition
        setTimeout(() => {
            const img = posterPreview.querySelector("img");
            if (img) img.style.opacity = "1";
        }, 50);

        // Update action drawer details
        fileNameDisplay.textContent = poster.name;
        btnDownload.href = poster.path;
        btnDownload.setAttribute("download", poster.name);
        resultsActions.classList.add("active");
        
        // Auto scroll preview into view on small screens
        if (window.innerWidth <= 1100) {
            document.getElementById("preview-container").scrollIntoView({ behavior: "smooth" });
        }
    }

    /* ==========================================================================
       3. Subprocess Execution & Loader Timers
       ========================================================================== */

    btnGenerate.addEventListener("click", async () => {
        // Enforce HTML5 Form validation
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const payload = {
            city: inputCity.value.trim(),
            country: inputCountry.value.trim(),
            theme: activeThemeId,
            distance: parseInt(inputDistance.value),
            width: parseFloat(inputWidth.value),
            height: parseFloat(inputHeight.value),
            format: inputFormat.value,
        };

        // Advanced option payloads
        if (inputLat.value.trim()) payload.latitude = inputLat.value.trim();
        if (inputLong.value.trim()) payload.longitude = inputLong.value.trim();
        if (inputDisplayCity.value.trim()) payload.display_city = inputDisplayCity.value.trim();
        if (inputDisplayCountry.value.trim()) payload.display_country = inputDisplayCountry.value.trim();
        if (inputFontFamily.value.trim()) payload.font_family = inputFontFamily.value.trim();
        if (inputCountryLabel.value.trim()) payload.country_label = inputCountryLabel.value.trim();

        // Activate glowing scanner loader
        scannerOverlay.classList.add("active");
        
        // Cycle loader phases periodically to give organic responsive feedback
        const loaderPhases = [
            "Geocoding location via Nominatim...",
            "Connecting to OpenStreetMap servers...",
            "Downloading road network graphs...",
            "Fetching riverways and coastal lines...",
            "Processing local parks and green layers...",
            "Applying high-fidelity layout margins...",
            "Drawing road geometries (hierarchy widths)...",
            "Synthesizing Google Typography fonts...",
            "Compiling final poster vector matrices..."
        ];

        let phaseIndex = 0;
        progressStatus.textContent = loaderPhases[0];
        
        const phaseTimer = setInterval(() => {
            phaseIndex = (phaseIndex + 1) % loaderPhases.length;
            progressStatus.textContent = loaderPhases[phaseIndex];
        }, 2200);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            clearInterval(phaseTimer);

            const result = await response.json();
            
            if (result.success) {
                // Succeeded! Load image
                loadPosterToPreview({
                    name: result.filename,
                    path: result.url
                });
                
                // Keep the raw output logs ready for inspection
                currentLogsText = result.log;
                
                // Refresh registry list
                fetchRecentPosters();
            } else {
                // Failed. Show logs drawer instantly
                currentLogsText = result.error;
                openLogsDrawer();
                showNotification("Generation failed. See console logs for details.", "error");
            }
        } catch (error) {
            clearInterval(phaseTimer);
            console.error("Generation request failed:", error);
            currentLogsText = `An unexpected communication error occurred:\n${error.message}`;
            openLogsDrawer();
        } finally {
            // Dismiss loader overlay
            scannerOverlay.classList.remove("active");
        }
    });

    /* ==========================================================================
       4. Systems Log Drawer Controls
       ========================================================================== */

    btnInspect.addEventListener("click", openLogsDrawer);
    btnCloseLogs.addEventListener("click", closeLogsDrawer);
    logsDrawerOverlay.addEventListener("click", (e) => {
        if (e.target === logsDrawerOverlay) closeLogsDrawer();
    });

    function openLogsDrawer() {
        logsConsole.textContent = currentLogsText || "No logs captured yet. Try generating a poster.";
        logsDrawerOverlay.classList.add("active");
    }

    function closeLogsDrawer() {
        logsDrawerOverlay.classList.remove("active");
    }

    /* ==========================================================================
       4b. Theme Customizer Drawer Controls & Mini Preview
       ========================================================================== */

    const btnOpenThemeBuilder = document.getElementById("btn-open-theme-builder");
    const btnCloseThemeBuilder = document.getElementById("btn-close-theme-builder");
    const themeBuilderOverlay = document.getElementById("theme-builder-overlay");
    const themeBuilderForm = document.getElementById("theme-builder-form");
    const btnSaveTheme = document.getElementById("btn-save-theme");

    const colorBg = document.getElementById("color-bg");
    const colorText = document.getElementById("color-text");
    const colorRoad = document.getElementById("color-road");
    const colorWater = document.getElementById("color-water");
    const colorParks = document.getElementById("color-parks");

    const miniCanvas = document.getElementById("mini-canvas-mock");
    const miniWater = document.getElementById("mini-water");
    const miniParks = document.getElementById("mini-parks");
    const miniRoads = document.querySelectorAll(".mini-road");
    const miniText = document.getElementById("mini-text");
    const miniSubtext = document.getElementById("mini-subtext");

    function updateMiniPreview() {
        miniCanvas.style.backgroundColor = colorBg.value;
        miniWater.style.backgroundColor = colorWater.value;
        miniParks.style.backgroundColor = colorParks.value;
        miniRoads.forEach(road => road.style.backgroundColor = colorRoad.value);
        miniText.style.color = colorText.value;
        miniSubtext.style.color = colorText.value;

        // Update hex labels
        colorBg.nextElementSibling.textContent = colorBg.value.toUpperCase();
        colorText.nextElementSibling.textContent = colorText.value.toUpperCase();
        colorRoad.nextElementSibling.textContent = colorRoad.value.toUpperCase();
        colorWater.nextElementSibling.textContent = colorWater.value.toUpperCase();
        colorParks.nextElementSibling.textContent = colorParks.value.toUpperCase();
    }

    [colorBg, colorText, colorRoad, colorWater, colorParks].forEach(picker => {
        picker.addEventListener("input", updateMiniPreview);
    });

    btnOpenThemeBuilder.addEventListener("click", () => {
        updateMiniPreview();
        themeBuilderOverlay.classList.add("active");
    });

    btnCloseThemeBuilder.addEventListener("click", () => {
        themeBuilderOverlay.classList.remove("active");
    });

    themeBuilderOverlay.addEventListener("click", (e) => {
        if (e.target === themeBuilderOverlay) {
            themeBuilderOverlay.classList.remove("active");
        }
    });

    btnSaveTheme.addEventListener("click", async () => {
        if (!themeBuilderForm.checkValidity()) {
            themeBuilderForm.reportValidity();
            return;
        }

        const payload = {
            name: document.getElementById("theme-name").value.trim(),
            description: document.getElementById("theme-desc").value.trim() || "Dynamic studio selection",
            bg: colorBg.value,
            text: colorText.value,
            road_primary: colorRoad.value,
            water: colorWater.value,
            parks: colorParks.value,
        };

        try {
            const response = await fetch("/api/themes/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.success) {
                showNotification(`Theme "${payload.name}" successfully added!`, "success");
                activeThemeId = result.theme_id;
                
                // Close builder drawer
                themeBuilderOverlay.classList.remove("active");
                
                // Clear builder form
                themeBuilderForm.reset();
                
                // Re-fetch themes list, which will automatically highlight and set the active theme!
                await fetchThemes();
            } else {
                showNotification(`Failed to save theme: ${result.error}`, "error");
            }
        } catch (error) {
            console.error("Theme saving failed:", error);
            showNotification(`Communication error saving theme.`, "error");
        }
    });

    /* ==========================================================================
       5. Simple Toast Notification helper
       ========================================================================== */

    function showNotification(message, type = "info") {
        const toast = document.createElement("div");
        toast.className = `premium-toast ${type}`;
        toast.innerHTML = `
            <div class="toast-body">
                <span class="toast-icon">${type === "error" ? "❌" : "ℹ️"}</span>
                <p class="toast-text">${message}</p>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Simple animations
        setTimeout(() => toast.classList.add("visible"), 50);
        setTimeout(() => {
            toast.classList.remove("visible");
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // Add toast CSS dynamic inject if not present
    const style = document.createElement('style');
    style.innerHTML = `
        .premium-toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: rgba(20, 20, 25, 0.9);
            border: 1px solid var(--border-glass);
            padding: 14px 20px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            box-shadow: var(--shadow-epic);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 1000;
        }
        .premium-toast.visible {
            transform: translateY(0);
            opacity: 1;
        }
        .toast-body {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .toast-icon { font-size: 16px; }
        .toast-text { font-size: 13px; font-weight: 500; color: #ffffff; }
    `;
    document.head.appendChild(style);
});
