import subprocess
import time
import socket
import sys

def is_port_open(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

def find_active_server_port(start_port=8080):
    for port in range(start_port, start_port + 20):
        if is_port_open(port):
            return port
    return None

def start_services():
    print("==================================================")
    print("STARTING MAPPOSTER LOCAL SERVICES")
    print("==================================================")

    # 1. Kill any existing python processes running server.py or lt/localtunnel on port 8080
    # On Windows, we can use Taskkill or let them fail/bind gracefully.
    
    # 2. Start Python server
    print("Launching Python dashboard/server.py...")
    server_log = open("server_stdout.log", "w", encoding="utf-8")
    server_proc = subprocess.Popen(
        [sys.executable, "dashboard/server.py"],
        stdout=server_log,
        stderr=subprocess.STDOUT,
        cwd="."
    )
    
    # Wait up to 5 seconds for the server to bind to a port
    print("Waiting for Python server to bind to a port...")
    active_port = None
    for _ in range(10):
        time.sleep(0.5)
        active_port = find_active_server_port(8080)
        if active_port:
            print(f"Python server is successfully running on port {active_port}!")
            break
    else:
        print("Error: Python server failed to start. Check server_stdout.log.")
        return

    # 3. Start localtunnel
    print(f"Launching localtunnel for port {active_port} (subdomain: maptoposter-dev-fenix)...")
    tunnel_log = open("tunnel_stdout.log", "w", encoding="utf-8")
    
    # On Windows, npx runs as npx.cmd
    npx_cmd = "npx.cmd" if sys.platform == "win32" else "npx"
    
    tunnel_proc = subprocess.Popen(
        [npx_cmd, "localtunnel", "--port", str(active_port), "--subdomain", "maptoposter-dev-fenix"],
        stdout=tunnel_log,
        stderr=subprocess.STDOUT,
        shell=True if sys.platform == "win32" else False
    )
    
    print("Waiting for localtunnel handshake...")
    time.sleep(5)
    
    # Read tunnel log to see if it successfully connected
    try:
        with open("tunnel_stdout.log", "r", encoding="utf-8") as f:
            log_content = f.read()
            print("\nTunnel stdout log output:")
            print(log_content)
    except Exception as e:
        print(f"Could not read tunnel_stdout.log: {e}")

    print("==================================================")
    print("MAPPOSTER SERVICES STARTED SUCCESSFULLY!")
    print("==================================================")
    
    # Keep the parent process alive so child subprocesses (server & localtunnel) don't get terminated
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping services...")
    finally:
        server_proc.terminate()
        tunnel_proc.terminate()

if __name__ == "__main__":
    start_services()
