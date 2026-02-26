from fastapi import FastAPI
from fastapi.responses import HTMLResponse, FileResponse
import os

app = FastAPI()

@app.get("/", response_class=HTMLResponse)
def hello_world():
    frontend_path = os.path.join(os.path.dirname(__file__), '../frontend/index.html')
    if not os.path.exists(frontend_path):
        # Try /app/frontend/index.html for Docker
        frontend_path = '/app/frontend/index.html'
    return FileResponse(frontend_path, media_type='text/html')

@app.get("/api/test")
def api_test():
    return {"message": "API call successful"}
