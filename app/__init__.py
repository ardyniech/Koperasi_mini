import sys, os
# Add the actual backend FastAPI app package directory to sys.path so imports like 'app.main' work.
backend_app_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "app"))
if backend_app_path not in sys.path:
    sys.path.insert(0, backend_app_path)
