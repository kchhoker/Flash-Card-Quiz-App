# Backend

Run the FastAPI backend:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API endpoints:
- `GET /api/cards` - returns all cards
- `GET /api/quiz?count=5` - returns a random selection
