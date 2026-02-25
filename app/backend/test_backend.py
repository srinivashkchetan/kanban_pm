import os
import json
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

KANBAN_DIR = os.path.join(os.path.dirname(__file__), 'kanban_data')
KANBAN_PATH = os.path.join(KANBAN_DIR, 'user.json')

def test_get_kanban():
    response = client.get('/api/kanban/user')
    assert response.status_code == 200
    data = response.json()
    assert 'columns' in data
    assert data['user'] == 'user'

def test_save_kanban():
    new_kanban = {
        "user": "user",
        "columns": [
            {"id": "todo", "title": "To Do", "cards": ["Task X"]},
            {"id": "done", "title": "Done", "cards": ["Task Y"]}
        ]
    }
    response = client.post('/api/kanban/user', json=new_kanban)
    assert response.status_code == 200
    assert response.json()['status'] == 'saved'
    with open(KANBAN_PATH, 'r') as f:
        saved = json.load(f)
    assert saved['columns'][0]['cards'][0] == 'Task X'
