import { useStadium } from '../context/StadiumContext';
import { useNavigate } from 'react-router-dom';
import { getCrowdStatus } from '../data/stadiumData';
import { Clock, Users, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FoodPage() {
  const { foodStalls, joinQueue, queues } = useStadium();
  const navigate = useNavigate();

  const bestStall = foodStalls.reduce(
    (a, b) => a.waitTime < b.waitTime ? a : b,
    foodStalls[0]
  );

  const getWaitColor = (time) => {
    if (time <= 5) return 'green';
    if (time <= 15) return 'yellow';
    return 'red';
  };

  const handleJoinQueue = (stall) => {
    const queueId = `food-${stall.id}`;
    const alreadyInQueue = queues.find(q => q.id === queueId);
    if (alreadyInQueue) {
      toast.error('Already in this queue!', {
        style: {
          background: '#0d1117', color: '#e6edf3',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      });
      return;
    }

    joinQueue({
      id: queueId,
      type: 'food',
      name: stall.name,
      icon: stall.icon,
      position: stall.queueLength,
    });
    toast.success(`Joined queue at ${stall.name}!`, {
      icon: stall.icon,
      style: {
        background: '#0d1117',
        color: '#e6edf3',
        border: '1px solid rgba(255,255,255,0.1)',
      },
    });
    navigate('/queue');
  };

  return (
    <div className="page-enter" role="region" aria-label="Food and Drinks">
      <header className="page-header">
        <div className="page-icon" aria-hidden="true">🍔</div>
        <h1>Food & Drinks</h1>
        <p>Find the fastest stall and skip the wait</p>
      </header>

      {/* Smart Suggestion Banner */}
      <div className="glass-card" style={{
        marginBottom: '20px',
        borderColor: 'rgba(34, 197, 94, 0.3)',
        background: 'rgba(34, 197, 94, 0.06)',
      }}
        role="alert"
      >
        <div className="flex items-center gap-sm">
          <Star size={18} style={{ color: 'var(--status-green)' }} aria-hidden="true" />
          <div>
            <h4 style={{ color: 'var(--status-green)' }}>Smart Pick</h4>
            <p style={{ fontSize: '0.8rem' }}>
              👉 Go to <strong style={{ color: 'var(--text-primary)' }}>{bestStall.name}</strong> for
              fastest service ({bestStall.waitTime} min wait)
            </p>
          </div>
        </div>
      </div>

      <div className="live-indicator" style={{ marginBottom: '16px' }}
        role="status" aria-live="polite"
      >
        <span className="live-dot" aria-hidden="true" />
        <span>Wait times updating live</span>
      </div>

      {/* Stall Cards */}
      <div className="cards-grid stagger-children" id="food-stalls-list" role="list"
        aria-label="Food stalls"
      >
        {foodStalls.map((stall) => {
          const isBest = stall.id === bestStall.id;
          const waitColor = getWaitColor(stall.waitTime);

          return (
            <article
              key={stall.id}
              className={`glass-card ${isBest ? 'recommended' : ''}`}
              id={`stall-${stall.id}`}
              role="listitem"
              aria-label={`${stall.name}, ${stall.cuisine}, ${stall.waitTime} minute wait, ${stall.queueLength} in line${isBest ? ', recommended' : ''}`}
            >
              <div className="card-row">
                <div style={{
                  width: 48, height: 48,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-glass)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', flexShrink: 0,
                }} aria-hidden="true">
                  {stall.icon}
                </div>
                <div className="card-info">
                  <h3>{stall.name}</h3>
                  <p className="meta">{stall.cuisine}</p>
                </div>
              </div>

              {/* Wait Time & Queue */}
              <div className="flex items-center justify-between" style={{ marginTop: '14px' }}>
                <div className="flex items-center gap-md">
                  <div className="flex items-center gap-sm">
                    <Clock size={14} style={{ color: `var(--status-${waitColor})` }} aria-hidden="true" />
                    <span style={{
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: `var(--status-${waitColor})`,
                    }}>
                      {stall.waitTime} min
                    </span>
                  </div>
                  <div className="flex items-center gap-sm text-xs text-muted">
                    <Users size={14} aria-hidden="true" />
                    <span>{stall.queueLength} in line</span>
                  </div>
                </div>

                <span className={`badge badge-${waitColor}`} style={{ fontSize: '0.65rem' }}>
                  {waitColor === 'green' ? '✅ Fast' : waitColor === 'yellow' ? '⚠️ Moderate' : '❌ Long'}
                </span>
              </div>

              {/* Progress bar */}
              <div className="progress-bar" style={{ marginTop: '10px' }}
                role="progressbar" aria-valuenow={Math.min(100, stall.waitTime * 4)}
                aria-valuemin={0} aria-valuemax={100}
                aria-label={`Wait time indicator: ${stall.waitTime} minutes`}
              >
                <div
                  className={`progress-fill ${waitColor}`}
                  style={{ width: `${Math.min(100, stall.waitTime * 4)}%` }}
                />
              </div>

              {/* Join Queue Button */}
              <button
                className="btn btn-primary btn-sm btn-full"
                style={{ marginTop: '14px' }}
                onClick={() => handleJoinQueue(stall)}
                id={`join-food-${stall.id}`}
                aria-label={`Join queue at ${stall.name}`}
              >
                Join Queue
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
