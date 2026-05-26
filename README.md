# Flash Card Quiz App

A simple quiz app where you flip through flash cards, reveal answers, and track your score.

Built with a **Python/FastAPI** backend and a **React** frontend.

---

## What it does

- Shows flash cards one at a time — click to reveal the answer
- Mark yourself Correct or Wrong, then move to the next card
- See your final score when the quiz is done
- Add, edit, and delete your own cards in the Manage Cards tab
- Cards are saved to a file on the server, so they persist between restarts

---

## Requirements

- Python 3.10 or newer
- Node.js 18 or newer

---

## Setup & Running

You need two terminals open — one for the backend, one for the frontend.

### Terminal 1 — Backend

```bash
cd backend

# Create a virtual environment (only needed the first time)
python3 -m venv .venv

# Activate it
source .venv/bin/activate          # Mac/Linux
# .venv\Scripts\activate           # Windows

# Install dependencies (only needed the first time)
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --port 8000
```

The backend runs at `http://localhost:8000`.

### Terminal 2 — Frontend

```bash
cd frontend

# Install dependencies (only needed the first time)
npm install

# Start the dev server
npm run dev
```

The app opens at `http://localhost:5173`.

---

## Stopping the servers

Press `Ctrl + C` in each terminal to stop the backend and frontend.

Or, to kill them by port in one command:

```bash
lsof -ti:8000,5173 | xargs kill
```

---

## Project structure

```
Flash-Card-Quiz-App/
├── backend/
│   ├── app/
│   │   ├── main.py       # API routes
│   │   ├── data.py       # Card storage (reads/writes cards.json)
│   │   └── cards.json    # Your saved cards (auto-created on first run)
│   └── requirements.txt
└── frontend/
    └── src/
        └── App.jsx       # All UI — quiz view and manage cards view
```
