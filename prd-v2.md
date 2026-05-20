# Project Requirements Document (PRD) – v2

## Uptime Kuma Dashboard Access
- **LAN URL**: `http://192.168.1.7/kuma/`
  - Accessible from any device on the local network.
  - Redirects (302) to `/dashboard` served by Uptime Kuma.
- **Tailscale Funnel URL**: `http://vaio.taild277bb.ts.net/kuma/`
  - Exposes the same dashboard over the internet via Tailscale Funnel (port 80).
  - No TLS termination by Funnel; Caddy provides internal TLS on port 443 for other services.
  - Works on Android browsers and other clients.

## Implementation Details
- **Caddy** reverse‑proxy configuration (`/etc/caddy/Caddyfile`):
  ```caddy
  :80 {
      reverse_proxy / http://127.0.0.1:5173
      reverse_proxy /api/ http://127.0.0.1:8000
      handle_path /kuma/* {
          reverse_proxy http://127.0.0.1:3001
      }
      handle_path /kuma {
          reverse_proxy http://127.0.0.1:3001
      }
      file_server
  }
  :443 {
      tls internal
      reverse_proxy / http://127.0.0.1:5173
      reverse_proxy /api/ http://127.0.0.1:8000
      handle_path /kuma/* {
          reverse_proxy http://127.0.0.1:3001
      }
      handle_path /kuma {
          reverse_proxy http://127.0.0.1:3001
      }
      file_server
  }
  ```
- **Tailscale Funnel** runs in the background exposing port **80** with path `/kuma`:
  ```bash
  sudo tailscale funnel --bg --yes --set-path /kuma 80
  ```
- **Uptime Kuma** runs as a systemd service listening on `127.0.0.1:3001`.

## Verification Steps
1. `curl -I http://192.168.1.7/kuma/` → `302 Found` → `/dashboard`.
2. `curl -I http://vaio.taild277bb.ts.net/kuma/` → `302 Found` → `/dashboard`.
3. Open both URLs in a browser (LAN or Android) – the dashboard UI loads correctly.
