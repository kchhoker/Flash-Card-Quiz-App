import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function FlashCard({ question, answer, flipped }) {
  return (
    <div style={{ perspective: '1000px' }} className="w-full h-52">
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center p-6 bg-white rounded-2xl shadow-md border border-gray-100"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-xl font-semibold text-gray-800 text-center">{question}</p>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center p-6 bg-indigo-50 rounded-2xl shadow-md border border-indigo-100"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-xl font-bold text-indigo-700 text-center">{answer}</p>
        </div>
      </motion.div>
    </div>
  )
}

function ManageCards() {
  const [cards, setCards] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editQ, setEditQ] = useState('')
  const [editA, setEditA] = useState('')
  const [newQ, setNewQ] = useState('')
  const [newA, setNewA] = useState('')

  useEffect(() => {
    fetch('/api/cards').then(r => r.json()).then(setCards)
  }, [])

  async function addCard() {
    if (!newQ.trim() || !newA.trim()) return
    const card = await fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: newQ.trim(), answer: newA.trim() }),
    }).then(r => r.json())
    setCards(c => [...c, card])
    setNewQ('')
    setNewA('')
  }

  async function saveEdit(id) {
    const card = await fetch(`/api/cards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: editQ.trim(), answer: editA.trim() }),
    }).then(r => r.json())
    setCards(c => c.map(x => x.id === id ? card : x))
    setEditingId(null)
  }

  async function removeCard(id) {
    await fetch(`/api/cards/${id}`, { method: 'DELETE' })
    setCards(c => c.filter(x => x.id !== id))
  }

  function startEdit(card) {
    setEditingId(card.id)
    setEditQ(card.question)
    setEditA(card.answer)
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {cards.map(card => (
          <motion.div
            key={card.id}
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            {editingId === card.id ? (
              <div className="space-y-2">
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={editQ}
                  onChange={e => setEditQ(e.target.value)}
                  placeholder="Question"
                />
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={editA}
                  onChange={e => setEditA(e.target.value)}
                  placeholder="Answer"
                  onKeyDown={e => e.key === 'Enter' && saveEdit(card.id)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(card.id)}
                    className="text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-sm px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800">{card.question}</p>
                  <p className="text-sm text-indigo-600 mt-1">{card.answer}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(card)}
                    className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeCard(card.id)}
                    className="text-xs px-2.5 py-1 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-dashed border-gray-300">
        <p className="text-sm font-semibold text-gray-600 mb-3">Add new card</p>
        <div className="space-y-2">
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={newQ}
            onChange={e => setNewQ(e.target.value)}
            placeholder="Question"
          />
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={newA}
            onChange={e => setNewA(e.target.value)}
            placeholder="Answer"
            onKeyDown={e => e.key === 'Enter' && addCard()}
          />
          <button
            onClick={addCard}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Add Card
          </button>
        </div>
      </div>
    </div>
  )
}

function QuizView({ onManage }) {
  const [cards, setCards] = useState([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)

  function loadQuiz() {
    setLoading(true)
    setFlipped(false)
    fetch('/api/quiz?count=5')
      .then(r => r.json())
      .then(data => { setCards(data); setIndex(0); setScore(0) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadQuiz() }, [])

  function next(correct) {
    if (correct) setScore(s => s + 1)
    setFlipped(false)
    setIndex(i => i + 1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-52">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 mb-4">No cards yet. Add some cards to get started.</p>
        <button
          onClick={onManage}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          Manage Cards
        </button>
      </div>
    )
  }

  if (index >= cards.length) {
    const pct = Math.round((score / cards.length) * 100)
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-10"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete</h2>
        <p className="text-gray-400 mb-1">Your score</p>
        <p className="text-5xl font-bold text-indigo-600 mb-2">{score}<span className="text-2xl text-gray-400 font-normal"> / {cards.length}</span></p>
        <div className="w-full bg-gray-100 rounded-full h-2 mt-4 mb-8">
          <motion.div
            className="bg-indigo-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <button
          onClick={loadQuiz}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-sm text-gray-400">
        <span>Card {index + 1} of {cards.length}</span>
        <span>Score: {score}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
        <div
          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${(index / cards.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.18 }}
        >
          <FlashCard question={cards[index].question} answer={cards[index].answer} flipped={flipped} />
        </motion.div>
      </AnimatePresence>

      <div className="mt-6">
        {!flipped ? (
          <button
            onClick={() => setFlipped(true)}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Reveal Answer
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => next(false)}
              className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
            >
              Wrong
            </button>
            <button
              onClick={() => next(true)}
              className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
            >
              Correct
            </button>
          </div>
        )}
      </div>

      {!flipped && (
        <p className="text-center text-xs text-gray-400 mt-3">Click to reveal, then mark yourself</p>
      )}
    </div>
  )
}

export default function App() {
  const [view, setView] = useState('quiz')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Flash Card Quiz</h1>
          <div className="flex gap-1">
            <button
              onClick={() => setView('quiz')}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                view === 'quiz' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Quiz
            </button>
            <button
              onClick={() => setView('manage')}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                view === 'manage' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Manage Cards
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {view === 'quiz' ? (
              <QuizView onManage={() => setView('manage')} />
            ) : (
              <ManageCards />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
