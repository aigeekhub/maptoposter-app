/* ==========================================================================
   MapPoster Studio - Interactive JS Application (Epic Award-Winning UX)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // UI State
    let activeThemeId = "terracotta";
    let systemThemes = [];
    let currentLogsText = "";
    
    // Leaflet state
    let cropMap = null;
    let mapVisible = false;

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
        const val = parseInt(e.target.value);
        distanceValue.textContent = `${val.toLocaleString()} meters`;
        if (cropMap && mapVisible) {
            cropMap.setZoom(getZoomFromDistance(val));
        }
    });

    function getZoomFromDistance(dist) {
        if (dist <= 1500) return 16;
        if (dist <= 3000) return 15;
        if (dist <= 6000) return 14;
        if (dist <= 12000) return 13;
        if (dist <= 24000) return 12;
        return 11;
    }

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
            const response = await fetch("api/themes");
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

            const hasPreview = theme.preview_image ? true : false;

            card.innerHTML = `
                <div class="theme-poster-thumbnail">
                    ${hasPreview ? 
                        `<img src="${theme.preview_image}" alt="${theme.name}" class="theme-mini-poster" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <div class="theme-bubble-split" style="display: none;">
                            <div class="bubble-bg" style="background-color: ${theme.bg}"></div>
                            <div class="bubble-accent" style="background-color: ${theme.road_primary}"></div>
                         </div>` : 
                        `<div class="theme-bubble-split">
                            <div class="bubble-bg" style="background-color: ${theme.bg}"></div>
                            <div class="bubble-accent" style="background-color: ${theme.road_primary}"></div>
                         </div>`
                    }
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

                // Auto update main placeholder canvas preview to show selected theme's mockup poster
                if (theme.preview_image) {
                    posterPreview.innerHTML = `
                        <img src="${theme.preview_image}" alt="${theme.name} Theme Preview" class="poster-img" style="opacity: 0; transition: opacity 0.5s ease; width: 100%; height: 100%; object-fit: contain; border-radius: 8px;">
                    `;
                    setTimeout(() => {
                        const img = posterPreview.querySelector("img");
                        if (img) img.style.opacity = "1";
                    }, 50);

                    // Mock the filename details
                    fileNameDisplay.textContent = `${theme.id}_preview.png`;
                    btnDownload.href = theme.preview_image;
                    btnDownload.setAttribute("download", `${theme.id}_preview.png`);
                    resultsActions.classList.add("active");
                }
            });

            themesGrid.appendChild(card);
        });

        // Set initial theme accent colors & preview
        const initialTheme = themes.find(t => t.id === activeThemeId);
        if (initialTheme) {
            updateAccentThemeColor(initialTheme);
            if (initialTheme.preview_image) {
                // Show default preview on load
                posterPreview.innerHTML = `
                    <img src="${initialTheme.preview_image}" alt="${initialTheme.name} Theme Preview" class="poster-img" style="opacity: 1; width: 100%; height: 100%; object-fit: contain; border-radius: 8px;">
                `;
                fileNameDisplay.textContent = `${initialTheme.id}_preview.png`;
                btnDownload.href = initialTheme.preview_image;
                btnDownload.setAttribute("download", `${initialTheme.id}_preview.png`);
                resultsActions.classList.add("active");
            }
        }
    }

    // Dynamically update UI accents based on selected theme
    function updateAccentThemeColor(theme) {
        document.documentElement.style.setProperty("--accent", theme.road_primary === "#ffffff" ? "#ef4444" : theme.road_primary);
        document.documentElement.style.setProperty("--accent-glow", `${theme.bg}40`);
    }

    // Fetch recently generated posters
    async function fetchRecentPosters() {
        try {
            const response = await fetch("api/recent");
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
            const response = await fetch("api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: response.statusText }));
                throw new Error(errorData.error || `Server responded with status ${response.status}`);
            }

            const initialResult = await response.json();
            
            if (!initialResult.success || !initialResult.task_id) {
                throw new Error(initialResult.error || "Failed to initialize poster generation task.");
            }

            const taskId = initialResult.task_id;
            let taskCompleted = false;

            // Start polling the background task status
            while (!taskCompleted) {
                // Wait for 2000ms before next poll
                await new Promise(resolve => setTimeout(resolve, 2000));

                const pollResponse = await fetch(`api/tasks/status?task_id=${taskId}`);
                if (!pollResponse.ok) {
                    throw new Error(`Failed to query task progress: ${pollResponse.statusText}`);
                }

                const taskState = await pollResponse.json();

                if (taskState.status === "completed") {
                    taskCompleted = true;
                    clearInterval(phaseTimer);

                    // Succeeded! Load image
                    loadPosterToPreview({
                        name: taskState.filename,
                        path: taskState.url
                    });

                    // Store stdout & stderr logs ready for inspection
                    currentLogsText = `=== SUBPROCESS COMPLETED SUCCESSFULLY ===\n\n--- STDOUT ---\n${taskState.stdout || ""}\n\n--- STDERR ---\n${taskState.stderr || ""}`;
                    
                    // Refresh registry list
                    fetchRecentPosters();
                } else if (taskState.status === "failed") {
                    taskCompleted = true;
                    clearInterval(phaseTimer);

                    currentLogsText = `=== SUBPROCESS FAILED ===\n\nError: ${taskState.error || "Unknown error"}\n\n--- STDOUT ---\n${taskState.stdout || ""}\n\n--- STDERR ---\n${taskState.stderr || ""}`;
                    openLogsDrawer();
                    showNotification("Generation failed. See console logs for details.", "error");
                }
                // If status is "running", loop continues and phaseTimer handles loader phase texts
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
            const response = await fetch("api/themes/save", {
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

    /* ==========================================================================
       6. Interactive Crop Map (Leaflet) Controls
       ========================================================================== */
    const btnToggleMap = document.getElementById("btn-toggle-map");
    const cropMapContainer = document.getElementById("crop-map-container");

    btnToggleMap.addEventListener("click", () => {
        mapVisible = !mapVisible;
        if (mapVisible) {
            cropMapContainer.style.display = "block";
            btnToggleMap.textContent = "🗺️ Hide Interactive Crop Map";
            btnToggleMap.classList.add("active");
            initCropMap();
        } else {
            cropMapContainer.style.display = "none";
            btnToggleMap.textContent = "🗺️ Crop Viewport Visually";
            btnToggleMap.classList.remove("active");
        }
    });

    function initCropMap() {
        if (cropMap) {
            setTimeout(() => cropMap.invalidateSize(), 50);
            return;
        }

        let initLat = parseFloat(inputLat.value) || 48.8588;
        let initLong = parseFloat(inputLong.value) || 2.3200;

        cropMap = L.map('crop-map', {
            zoomControl: false,
            attributionControl: false
        }).setView([initLat, initLong], getZoomFromDistance(parseInt(inputDistance.value)));

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 20
        }).addTo(cropMap);

        // Map movement updates override lat/lon
        cropMap.on('move', () => {
            const center = cropMap.getCenter();
            inputLat.value = center.lat.toFixed(6);
            inputLong.value = center.lng.toFixed(6);
        });

        // Zoom movement updates map distance / radius
        cropMap.on('zoomend', () => {
            const bounds = cropMap.getBounds();
            const east = bounds.getEast();
            const center = cropMap.getCenter();
            
            // Calculate distance in meters
            const distanceMeters = center.distanceTo(L.latLng(center.lat, east));
            const clampedDist = Math.max(3000, Math.min(25000, Math.round(distanceMeters)));
            
            inputDistance.value = clampedDist;
            distanceValue.textContent = `${clampedDist.toLocaleString()} meters`;
        });
    }

    // Geocoding auto-pan link when location inputs blur
    async function geocodeAndPanMap() {
        const city = inputCity.value.trim();
        const country = inputCountry.value.trim();
        if (!city || !country) return;

        try {
            const query = `${city}, ${country}`;
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    
                    inputLat.value = lat.toFixed(6);
                    inputLong.value = lon.toFixed(6);
                    
                    if (cropMap) {
                        cropMap.setView([lat, lon], cropMap.getZoom());
                    }
                }
            }
        } catch (e) {
            console.warn("Autofocus geocoding failed: ", e);
        }
    }
    inputCity.addEventListener("blur", geocodeAndPanMap);
    inputCountry.addEventListener("blur", geocodeAndPanMap);

    /* ==========================================================================
       7. Print-on-Demand (POD) Checkout Simulator
       ========================================================================== */
    const btnOpenPod = document.getElementById("btn-open-pod");
    const btnClosePod = document.getElementById("btn-close-pod");
    const podModalOverlay = document.getElementById("pod-modal-overlay");
    const podPosterPreview = document.getElementById("pod-poster-preview");
    const podProductType = document.getElementById("pod-product-type");
    const podSize = document.getElementById("pod-size");
    const podTotalPrice = document.getElementById("pod-total-price");
    const podShippingForm = document.getElementById("pod-shipping-form");
    const podCheckoutOverlay = document.getElementById("pod-checkout-overlay");
    const btnSubmitPod = document.getElementById("btn-submit-pod");
    const podProgressDetails = document.getElementById("pod-progress-details");

    // Dynamic price updates
    podSize.addEventListener("change", () => {
        const selectedOption = podSize.options[podSize.selectedIndex];
        const price = selectedOption.getAttribute("data-price");
        podTotalPrice.textContent = `$${price} USD`;
    });

    btnOpenPod.addEventListener("click", () => {
        const previewImg = posterPreview.querySelector("img");
        if (!previewImg) {
            showNotification("Please select a style theme or generate a poster first.", "info");
            return;
        }
        podPosterPreview.src = previewImg.src;
        podModalOverlay.classList.add("active");
    });

    function closePodModal() {
        podModalOverlay.classList.remove("active");
        podCheckoutOverlay.style.display = "none";
        
        // Reset overlay back to loader state
        podProgressDetails.innerHTML = `
            <div class="spinner" style="border-top-color: var(--accent);"></div>
            <div class="progress-title" id="pod-checkout-status-title" style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: var(--text-primary);">Submitting Print File...</div>
            <div class="progress-status" id="pod-checkout-status-desc" style="font-size: 13px; color: var(--text-secondary);">Uploading high-resolution vector assets...</div>
            <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; margin-top: 15px; overflow: hidden; position: relative;">
                <div id="pod-checkout-progress-bar" style="width: 0%; height: 100%; background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); transition: width 0.4s ease;"></div>
            </div>
        `;
        podShippingForm.reset();
    }

    btnClosePod.addEventListener("click", closePodModal);
    podModalOverlay.addEventListener("click", (e) => {
        if (e.target === podModalOverlay) closePodModal();
    });

    btnSubmitPod.addEventListener("click", () => {
        if (!podShippingForm.checkValidity()) {
            podShippingForm.reportValidity();
            return;
        }

        podCheckoutOverlay.style.display = "flex";
        
        const statusTitle = document.getElementById("pod-checkout-status-title");
        const statusDesc = document.getElementById("pod-checkout-status-desc");
        const progressBar = document.getElementById("pod-checkout-progress-bar");

        // Step 1: Upload (0% -> 1.2s)
        progressBar.style.width = "25%";
        statusTitle.textContent = "Uploading High-Resolution File to Printful...";
        statusDesc.textContent = "Syncing raster/vector source maps to cloud print storage...";

        setTimeout(() => {
            // Step 2: Address check (25% -> 2.4s)
            progressBar.style.width = "55%";
            statusTitle.textContent = "Validating Shipping Destination...";
            statusDesc.textContent = "Verifying shipping address matches delivery carrier routing API...";

            setTimeout(() => {
                // Step 3: Print Routing (55% -> 3.6s)
                progressBar.style.width = "85%";
                statusTitle.textContent = "Routing Order to Local Factory...";
                statusDesc.textContent = "Selecting nearest printing and framing warehouse to " + document.getElementById("pod-city").value + "...";

                setTimeout(() => {
                    // Step 4: Checkout complete (85% -> 4.5s)
                    progressBar.style.width = "100%";
                    statusTitle.textContent = "Creating Secure Checkout Order...";
                    statusDesc.textContent = "Compiling wholesale invoicing details...";

                    setTimeout(() => {
                        // Complete dropship order success screen
                        const orderNum = `PF-${Math.floor(Math.random() * 900000) + 100000}`;
                        podProgressDetails.innerHTML = `
                            <div class="pod-checkout-success">
                                <div class="success-icon">✓</div>
                                <h3>Order Placed Successfully!</h3>
                                <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
                                    Your mock dropship order has been processed.
                                </p>
                                <div class="pod-order-number">Order ID: ${orderNum}</div>
                                <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4; margin: 5px 0;">
                                    In production, this automatically calls Printful's API to print, package, and dropship this map directly to the customer.
                                </p>
                                <button id="btn-close-pod-success" class="action-btn" style="margin-top: 15px; padding: 10px 20px; background: rgba(255,255,255,0.06); border: 1px solid var(--border-glass); border-radius: 8px; cursor: pointer; color: var(--text-primary); font-weight: 600;">
                                    Done
                                </button>
                             </div>
                        `;
                        
                        document.getElementById("btn-close-pod-success").addEventListener("click", () => {
                            closePodModal();
                        });
                        
                        showNotification("Mock dropship order completed!", "success");
                    }, 1000);
                }, 1200);
            }, 1200);
        }, 1200);
    });

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
