import { useState, useRef, useCallback } from 'react';
import { useStadium } from '../context/StadiumContext';
import { wheelPrizes, quizQuestions } from '../data/stadiumData';
import { Trophy, RotateCcw, HelpCircle, Star, Sparkles, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

// ── Max spins per session ──
const MAX_SPINS = 3;
const SPINS_KEY = 'stadium-spins-used';

/**
 * Reads the number of spins used today from localStorage.
 * Resets daily so users get fresh spins each event day.
 * @returns {number} spins used today
 */
function getSpinsUsed() {
  try {
    const raw = localStorage.getItem(SPINS_KEY);
    if (!raw) return 0;
    const data = JSON.parse(raw);
    const today = new Date().toDateString();
    if (data.date !== today) return 0;
    return data.count || 0;
  } catch {
    return 0;
  }
}

/**
 * Records a spin usage in localStorage, scoped to today's date.
 * @param {number} count
 */
function setSpinsUsed(count) {
  localStorage.setItem(SPINS_KEY, JSON.stringify({
    date: new Date().toDateString(),
    count,
  }));
}

// ── Confetti Burst (visual-only, pointer-events: none) ──
function spawnConfetti() {
  const colors = ['#00d4ff', '#7c3aed', '#22c55e', '#eab308', '#ef4444', '#ec4899'];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.setAttribute('aria-hidden', 'true');
    el.style.left = `${Math.random() * 100}vw`;
    el.style.top = `${Math.random() * -20}px`;
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDelay = `${Math.random() * 0.5}s`;
    el.style.width = `${Math.random() * 8 + 4}px`;
    el.style.height = `${Math.random() * 8 + 4}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
}

export default function GamePage() {
  const { points, addPoints } = useStadium();
  const [activeTab, setActiveTab] = useState('wheel');

  return (
    <div className="page-enter" role="region" aria-label="Stadium Fun Zone">
      <header className="page-header text-center">
        <div className="page-icon" aria-hidden="true">🎮</div>
        <h1>Stadium Fun Zone</h1>
        <p>Play games, earn points, win rewards!</p>
      </header>

      {/* Score Display */}
      <div className="score-display" id="points-display" role="status" aria-live="polite"
        aria-label={`Total points: ${points}`}
      >
        <div className="flex flex-col items-center">
          <span className="score-label">Total Points</span>
          <span className="score-value">{points}</span>
        </div>
        <div style={{
          width: 1,
          height: 40,
          background: 'rgba(255,255,255,0.1)',
          margin: '0 16px',
        }} aria-hidden="true" />
        <div className="flex flex-col items-center">
          <span className="score-label">Rank</span>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: points >= 100 ? 'var(--status-green)' : 'var(--accent-cyan)',
          }}>
            {points >= 200 ? '🏆 Legend' : points >= 100 ? '⭐ Pro' : points >= 50 ? '🎯 Rising' : '🌱 Rookie'}
          </span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-sm" style={{ marginBottom: '20px' }} role="tablist" aria-label="Game modes">
        <button
          className={`chip ${activeTab === 'wheel' ? 'active' : ''}`}
          onClick={() => setActiveTab('wheel')}
          role="tab"
          aria-selected={activeTab === 'wheel'}
          id="tab-wheel"
          aria-controls="panel-wheel"
        >
          🎡 Spin Wheel
        </button>
        <button
          className={`chip ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
          role="tab"
          aria-selected={activeTab === 'quiz'}
          id="tab-quiz"
          aria-controls="panel-quiz"
        >
          🧠 Stadium Quiz
        </button>
      </div>

      {activeTab === 'wheel'
        ? <div role="tabpanel" id="panel-wheel" aria-labelledby="tab-wheel">
            <SpinWheel addPoints={addPoints} />
          </div>
        : <div role="tabpanel" id="panel-quiz" aria-labelledby="tab-quiz">
            <QuizGame addPoints={addPoints} />
          </div>
      }
    </div>
  );
}

// ═══════════════════════════════════════════════
// SPIN WHEEL — Limited to 3 spins per day
// ═══════════════════════════════════════════════
function SpinWheel({ addPoints }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [spinsUsed, setSpinsUsedState] = useState(getSpinsUsed);
  const wheelRef = useRef(null);

  const segCount = wheelPrizes.length;
  const segAngle = 360 / segCount;
  const spinsRemaining = MAX_SPINS - spinsUsed;
  const canSpin = spinsRemaining > 0 && !spinning;

  const spin = useCallback(() => {
    if (!canSpin) return;
    setSpinning(true);
    setResult(null);

    // Random landing position
    const spins = 5 + Math.random() * 3; // 5-8 full spins
    const landIndex = Math.floor(Math.random() * segCount);
    const landAngle = 360 - (landIndex * segAngle + segAngle / 2);
    const totalRotation = rotation + spins * 360 + landAngle;

    setRotation(totalRotation);

    // Update spins used
    const newCount = spinsUsed + 1;
    setSpinsUsedState(newCount);
    setSpinsUsed(newCount);

    setTimeout(() => {
      const prize = wheelPrizes[landIndex];
      setResult(prize);
      setSpinning(false);
      addPoints(prize.points);
      spawnConfetti();
      toast.success(`🎉 You won: ${prize.label} (+${prize.points} pts)`, {
        style: {
          background: '#0d1117', color: '#e6edf3',
          border: '1px solid rgba(0,212,255,0.3)',
        },
      });
    }, 4200);
  }, [canSpin, rotation, segCount, segAngle, addPoints, spinsUsed]);

  return (
    <div>
      {/* Spins Remaining Indicator */}
      <div className="spins-remaining" aria-label={`${spinsRemaining} spins remaining out of ${MAX_SPINS}`}>
        <span style={{ marginRight: '8px', fontSize: '0.8rem', fontWeight: 600 }}>Spins:</span>
        {Array.from({ length: MAX_SPINS }).map((_, i) => (
          <div
            key={i}
            className={`spin-dot ${i < spinsUsed ? 'used' : 'available'}`}
            aria-hidden="true"
          />
        ))}
        <span style={{ marginLeft: '8px', fontWeight: 700, color: spinsRemaining > 0 ? 'var(--accent-cyan)' : 'var(--status-red)' }}>
          {spinsRemaining} left
        </span>
      </div>

      <div className="wheel-container" style={{ marginBottom: '24px' }} aria-hidden="true">
        <div className="wheel-pointer" />
        <div
          ref={wheelRef}
          className="wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            background: `conic-gradient(${
              wheelPrizes.map((p, i) =>
                `${p.color} ${i * segAngle}deg ${(i + 1) * segAngle}deg`
              ).join(', ')
            })`,
          }}
        >
          {wheelPrizes.map((prize, i) => {
            const angle = i * segAngle + segAngle / 2 - 90;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  transform: `rotate(${angle}deg)`,
                  paddingRight: '20px',
                }}
              >
                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: 'white',
                  textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                  transform: i >= segCount / 2 ? 'rotate(180deg)' : 'none',
                  maxWidth: '70px',
                  textAlign: 'center',
                }}>
                  {prize.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spin Button */}
      <button
        className={`btn ${canSpin ? 'btn-primary' : 'btn-secondary'} btn-full`}
        onClick={spin}
        disabled={!canSpin}
        id="spin-btn"
        style={{ padding: '16px', fontSize: '1rem' }}
        aria-label={canSpin ? `Spin the wheel. ${spinsRemaining} spins remaining.` : 'No spins remaining today.'}
      >
        {spinning ? (
          <>
            <RotateCcw size={20} className="pulse" aria-hidden="true" />
            Spinning...
          </>
        ) : canSpin ? (
          <>
            <Sparkles size={20} aria-hidden="true" />
            Spin the Wheel! ({spinsRemaining}/{MAX_SPINS})
          </>
        ) : (
          <>
            <Lock size={20} aria-hidden="true" />
            No Spins Left Today
          </>
        )}
      </button>

      {/* Result */}
      {result && !spinning && (
        <div className="glass-card text-center" style={{
          marginTop: '20px',
          borderColor: 'rgba(0,212,255,0.3)',
          background: 'rgba(0,212,255,0.06)',
        }}
          role="alert"
          aria-live="assertive"
        >
          <div style={{ fontSize: '2rem', marginBottom: '8px' }} aria-hidden="true">🎉</div>
          <h3>You won!</h3>
          <p style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--accent-cyan)',
            marginTop: '4px',
          }}>
            {result.label}
          </p>
          <p className="text-xs text-muted" style={{ marginTop: '4px' }}>
            +{result.points} points added
          </p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// QUIZ GAME
// ═══════════════════════════════════════════════
function QuizGame({ addPoints }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const question = quizQuestions[questionIndex];

  const handleAnswer = (optIndex) => {
    if (selected !== null) return;
    setSelected(optIndex);

    const isCorrect = optIndex === question.correct;
    if (isCorrect) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (questionIndex < quizQuestions.length - 1) {
        setQuestionIndex(i => i + 1);
        setSelected(null);
      } else {
        const totalPoints = (score + (isCorrect ? 1 : 0)) * 10;
        addPoints(totalPoints);
        setFinished(true);
        if (totalPoints >= 30) spawnConfetti();
      }
    }, 1200);
  };

  const reset = () => {
    setQuestionIndex(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  };

  if (finished) {
    const finalScore = score;
    return (
      <div className="glass-card text-center" style={{ padding: '40px 24px' }}
        role="alert" aria-live="polite"
      >
        <div style={{ fontSize: '3rem', marginBottom: '12px' }} aria-hidden="true">
          {finalScore >= 4 ? '🏆' : finalScore >= 2 ? '⭐' : '💪'}
        </div>
        <h2>Quiz Complete!</h2>
        <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '8px' }}>
          {finalScore} / {quizQuestions.length} correct
        </p>
        <p className="text-sm text-muted" style={{ marginTop: '4px' }}>
          +{finalScore * 10} points earned
        </p>
        <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={reset}
          aria-label="Play the quiz again"
        >
          <RotateCcw size={18} aria-hidden="true" /> Play Again
        </button>
      </div>
    );
  }

  return (
    <div role="region" aria-label={`Quiz question ${questionIndex + 1} of ${quizQuestions.length}`}>
      {/* Progress */}
      <div className="flex justify-between items-center mb-md">
        <span className="text-xs text-muted">
          Question {questionIndex + 1} of {quizQuestions.length}
        </span>
        <span className="badge badge-green" aria-label={`${score} correct so far`}>{score} correct</span>
      </div>
      <div className="progress-bar mb-md"
        role="progressbar"
        aria-valuenow={questionIndex + 1}
        aria-valuemin={1}
        aria-valuemax={quizQuestions.length}
        aria-label={`Question ${questionIndex + 1} of ${quizQuestions.length}`}
      >
        <div
          className="progress-fill cyan"
          style={{ width: `${((questionIndex + 1) / quizQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <fieldset className="glass-card" style={{ marginBottom: '16px', border: '1px solid var(--bg-glass-border)' }}>
        <legend className="sr-only">
          Question {questionIndex + 1}: {question.question}
        </legend>
        <div className="flex items-center gap-sm mb-md">
          <HelpCircle size={20} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
          <h3>{question.question}</h3>
        </div>

        <div className="cards-grid" style={{ gap: '10px' }}>
          {question.options.map((opt, i) => {
            let style = {};
            if (selected !== null) {
              if (i === question.correct) {
                style = { borderColor: 'var(--status-green)', background: 'var(--status-green-bg)' };
              } else if (i === selected && i !== question.correct) {
                style = { borderColor: 'var(--status-red)', background: 'var(--status-red-bg)' };
              }
            }

            return (
              <button
                key={i}
                className="glass-card"
                style={{
                  cursor: selected === null ? 'pointer' : 'default',
                  padding: '14px 16px',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  ...style,
                }}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                aria-label={`Option ${String.fromCharCode(65 + i)}: ${opt}`}
              >
                <span style={{ marginRight: '10px', opacity: 0.5 }} aria-hidden="true">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
