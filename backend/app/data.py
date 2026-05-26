import json
import random
from pathlib import Path

DATA_FILE = Path(__file__).parent / "cards.json"

_default_cards = [
    {"id": 1, "question": "What is the capital of France?", "answer": "Paris"},
    {"id": 2, "question": "What is 2 + 2?", "answer": "4"},
    {"id": 3, "question": "What color is the sky on a clear day?", "answer": "Blue"},
    {"id": 4, "question": "What programming language is this backend written in?", "answer": "Python"},
    {"id": 5, "question": "What library powers the frontend?", "answer": "React"},
]


def _load() -> list[dict]:
    if not DATA_FILE.exists():
        _save(_default_cards)
        return _default_cards
    return json.loads(DATA_FILE.read_text())


def _save(cards: list[dict]) -> None:
    DATA_FILE.write_text(json.dumps(cards, indent=2))


def get_cards() -> list[dict]:
    return _load()


def get_quiz(count: int = 5) -> list[dict]:
    cards = _load()
    return random.sample(cards, min(count, len(cards)))


def create_card(question: str, answer: str) -> dict:
    cards = _load()
    new_id = max((c["id"] for c in cards), default=0) + 1
    card = {"id": new_id, "question": question, "answer": answer}
    cards.append(card)
    _save(cards)
    return card


def update_card(card_id: int, question: str, answer: str) -> dict | None:
    cards = _load()
    for card in cards:
        if card["id"] == card_id:
            card["question"] = question
            card["answer"] = answer
            _save(cards)
            return card
    return None


def delete_card(card_id: int) -> bool:
    cards = _load()
    new_cards = [c for c in cards if c["id"] != card_id]
    if len(new_cards) == len(cards):
        return False
    _save(new_cards)
    return True
