#!/usr/bin/env python3
"""
SPA static server with API proxy fallback to index.html
"""
import http.server
import socketserver
import os
import urllib.request
import urllib.error

PORT = 8080
DIRECTORY = "/home/ardy/koperasi_mini/frontend/dist"
BACKEND_URL = "http://127.0.0.1:8000"

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def do_GET(self):
        # Proxy API requests to backend
        if self.path.startswith('/api/'):
            self.proxy_request('GET')
            return
    def do_GET(self):
        # Log all requests
        print(f"[SPA GET] {self.path}")
        
        # Proxy API requests to backend
        if self.path.startswith('/api/'):
            self.proxy_request('GET')
            return
        
        # Check if file exists
        path = self.path.lstrip('/')
        if '?' in path:
            path = path.split('?')[0]
        
        file_path = os.path.join(DIRECTORY, path)
        print(f"[SPA GET] Looking for: {file_path}, exists: {os.path.exists(file_path)}")
        
        # If file doesn't exist and it's not a file with extension, serve index.html
        if not os.path.exists(file_path) and '/' != self.path:
            # Check if it looks like a file (has extension)
            basename = os.path.basename(path.split('?')[0])
            if '.' not in basename:
                # It's a route, serve index.html
                print(f"[SPA GET] Route detected, serving index.html")
                self.path = '/index.html'
        
        super().do_GET()
    
    def do_POST(self):
        # Proxy API requests to backend
        if self.path.startswith('/api/'):
            self.proxy_request('POST')
            return
        self.send_error(404)
    
    def do_PUT(self):
        if self.path.startswith('/api/'):
            self.proxy_request('PUT')
            return
        self.send_error(404)
    
    def do_DELETE(self):
        if self.path.startswith('/api/'):
            self.proxy_request('DELETE')
            return
        self.send_error(404)
    
    def do_OPTIONS(self):
        if self.path.startswith('/api/'):
            self.proxy_request('OPTIONS')
            return
        self.send_error(404)
    
    def proxy_request(self, method):
        """Proxy request to backend server"""
        try:
            # Build target URL
            target_url = BACKEND_URL + self.path
            
            # Read request body for POST/PUT
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else None
            
            # Create request
            req = urllib.request.Request(
                target_url,
                data=body,
                method=method,
                headers={k: v for k, v in self.headers.items() if k.lower() != 'host'}
            )
            
            # Forward request
            with urllib.request.urlopen(req, timeout=30) as response:
                # Send response headers
                self.send_response(response.status)
                for header, value in response.headers.items():
                    if header.lower() not in ['transfer-encoding', 'connection']:
                        self.send_header(header, value)
                self.end_headers()
                
                # Send response body
                self.wfile.write(response.read())
        
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            for header, value in e.headers.items():
                if header.lower() not in ['transfer-encoding', 'connection']:
                    self.send_header(header, value)
            self.end_headers()
            self.wfile.write(e.read())
        
        except Exception as e:
            print(f"[Proxy Error] {method} {self.path}: {e}")
            self.send_error(502, f"Proxy Error: {e}")
    
    def log_message(self, format, *args):
        # Log all requests including 404s
        print(f"[SPA] {self.address_string()} - {format % args}")

class ReuseTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

if __name__ == "__main__":
    with ReuseTCPServer(("", PORT), SPAHandler) as httpd:
        print(f"SPA Server at port {PORT}, serving {DIRECTORY}")
        print(f"Proxying /api/* requests to {BACKEND_URL}")
        httpd.serve_forever()
