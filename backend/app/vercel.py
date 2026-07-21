import os
import sys

# Ensure backend directory is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from app.main import app

class StripPrefixMiddleware:
    def __init__(self, app, prefix):
        self.app = app
        self.prefix = prefix

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            path = scope.get("path", "")
            if path.startswith(self.prefix):
                scope["path"] = path[len(self.prefix):]
                if not scope["path"].startswith("/"):
                    scope["path"] = "/" + scope["path"]
            raw_path = scope.get("raw_path", b"")
            prefix_bytes = self.prefix.encode("utf-8")
            if raw_path.startswith(prefix_bytes):
                scope["raw_path"] = raw_path[len(prefix_bytes):]
                if not scope["raw_path"].startswith(b"/"):
                    scope["raw_path"] = b"/" + scope["raw_path"]
        await self.app(scope, receive, send)

app = StripPrefixMiddleware(app, "/backend")
