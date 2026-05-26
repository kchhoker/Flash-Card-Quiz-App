from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .data import get_cards, get_quiz, create_card, update_card, delete_card

app = FastAPI(title="Flash Card Quiz API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CardBody(BaseModel):
    question: str
    answer: str


@app.get("/api/cards")
def read_cards():
    return get_cards()


@app.get("/api/quiz")
def read_quiz(count: int = Query(5, ge=1, le=50)):
    return get_quiz(count)


@app.post("/api/cards", status_code=201)
def add_card(body: CardBody):
    return create_card(body.question, body.answer)


@app.put("/api/cards/{card_id}")
def edit_card(card_id: int, body: CardBody):
    card = update_card(card_id, body.question, body.answer)
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return card


@app.delete("/api/cards/{card_id}", status_code=204)
def remove_card(card_id: int):
    if not delete_card(card_id):
        raise HTTPException(status_code=404, detail="Card not found")
