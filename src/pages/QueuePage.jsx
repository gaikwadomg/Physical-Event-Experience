import { useEffect, useRef, useCallback } from 'react';
import { useStadium } from '../context/StadiumContext';
import { Clock, CheckCircle, X, Bell, BellRing } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Sends a browser notification if permission is granted.
 * Falls back to toast if notifications aren't available.
 * @param {string} title - notification title
 * @param {string} body - notification body
 */
function sendBrowserNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '🏟️',
        badge: '🏟️',
        vibrate: [200, 100, 200],
        tag: 'stadium-queue', // Prevents duplicate notifications
        requireInteraction: true,
      });
    } catch {
      // Fallback handled by toast below
    }
  }
}

export default function QueuePage() {
  const { queues, removeQueue } = useStadium();
  const prevPositions = useRef({});
  const notifRequested = useRef(false);

  // Request notification permission on first visit
  useEffect(() => {
    if (!notifRequested.current && 'Notification' in window && Notification.permission === 'default') {
      notifRequested.current = true;
      // Delay to not be intrusive
      const timer = setTimeout(() => {
        Notification.requestPermission();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Watch for "your turn" notifications — fire browser notif + toast
  useEffect(() => {
    queues.forEach((q) => {
      const prev = prevPositions.current[q.id];

      // Position reached 0 — YOUR TURN
      if (prev !== undefined && prev > 0 && q.position === 0) {
        const message = `Your turn now! Go to Counter ${q.counter}`;

        // Browser notification (works even if tab is background)
        sendBrowserNotification(
          `🎉 ${q.name} — Ready!`,
          message
        );

        // In-app toast
        toast.success(
          `🎉 ${message}`,
          {
            duration: 10000,
            icon: q.icon || '🔔',
            style: {
              background: '#0d1117',
              color: '#e6edf3',
              border: '1px solid rgba(34,197,94,0.3)',
              fontSize: '0.9rem',
              fontWeight: 600,
            },
          }
        );

        // Play notification sound
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1wdHmBjJGQi4F1aGJjbXeBi5OTjYN3aWFhZnF+ipOTjoR5a2RkZ3F9iJGRjIF2aWJkZ3J+h5CQiH5ybGZnaXR+h4+Nhn10bmxsbnV+houKhYB3dHR0dnp+goWFhIKBgH9/fn8=');
          audio.volume = 0.3;
          audio.play().catch(() => {});
        } catch {
          // Audio not critical
        }
      }

      // Position is 2 — "coming up soon" reminder
      if (prev !== undefined && prev > 2 && q.position === 2) {
        toast(`⏰ Almost your turn at ${q.name}! Get ready.`, {
          icon: '🔔',
          duration: 6000,
          style: {
            background: '#0d1117',
            color: '#e6edf3',
            border: '1px solid rgba(0,212,255,0.3)',
          },
        });

        sendBrowserNotification(
          `⏰ ${q.name} — Almost Ready`,
          `You're #2 in line. Get ready to go to Counter ${q.counter}!`
        );
      }

      prevPositions.current[q.id] = q.position;
    });
  }, [queues]);

  const requestNotifPermission = useCallback(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  const activeQueues = queues.filter(q => q.position > 0);
  const completedQueues = queues.filter(q => q.position === 0);
  const hasNotifPermission = 'Notification' in window && Notification.permission === 'granted';

  return (
    <div className="page-enter" role="region" aria-label="My Queues">
      <header className="page-header">
        <div className="page-icon" aria-hidden="true">⏳</div>
        <h1>My Queues</h1>
        <p>Track your position in real-time</p>
      </header>

      {/* Notification permission prompt */}
      {'Notification' in window && Notification.permission !== 'granted' && (
        <button
          className="glass-card"
          style={{
            marginBottom: '16px',
            padding: '14px 20px',
            cursor: 'pointer',
            borderColor: 'rgba(0,212,255,0.2)',
            width: '100%',
            textAlign: 'left',
          }}
          onClick={requestNotifPermission}
          id="enable-notifications-btn"
          aria-label="Enable browser notifications to get alerts when your queue is ready"
        >
          <div className="flex items-center gap-sm">
            <Bell size={18} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
            <div>
              <h4 style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>Enable Notifications</h4>
              <p style={{ fontSize: '0.75rem' }}>Get alerts even when you leave this tab</p>
            </div>
          </div>
        </button>
      )}

      {queues.length === 0 && (
        <div className="glass-card text-center" style={{ padding: '40px 24px' }}
          role="status"
        >
          <div style={{ fontSize: '3rem', marginBottom: '12px', opacity: 0.5 }} aria-hidden="true">📋</div>
          <h3 style={{ marginBottom: '4px' }}>No Active Queues</h3>
          <p>Join a queue from Food or Washroom pages</p>
        </div>
      )}

      {/* Active Queues */}
      {activeQueues.length > 0 && (
        <section aria-label="Active queues">
          <div className="section-divider" role="separator">
            <span>Active</span>
          </div>
          <div className="cards-grid stagger-children" id="active-queues" role="list">
            {activeQueues.map((q) => {
              const progress = ((q.maxPosition - q.position) / q.maxPosition) * 100;

              return (
                <article key={q.id} className="glass-card" id={`queue-${q.id}`} role="listitem"
                  aria-label={`${q.name} — position ${q.position}, about ${q.position * 2} minutes remaining`}
                >
                  <div className="card-row">
                    <div className="queue-position" aria-label={`Position number ${q.position}`}>
                      #{q.position}
                    </div>
                    <div className="card-info">
                      <h3>{q.name}</h3>
                      <div className="flex items-center gap-sm mt-sm">
                        <span className={`badge badge-${q.type === 'food' ? 'yellow' : 'green'}`}>
                          {q.type === 'food' ? '🍔 Food' : '🚻 Washroom'}
                        </span>
                        <span className="text-xs text-muted flex items-center gap-sm">
                          <Clock size={12} aria-hidden="true" />
                          ~{q.position * 2} min
                        </span>
                      </div>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => removeQueue(q.id)}
                      aria-label={`Leave queue for ${q.name}`}
                      style={{ padding: '8px' }}
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  </div>

                  {/* Progress */}
                  <div style={{ marginTop: '14px' }}>
                    <div className="flex justify-between text-xs text-muted mb-md">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="progress-bar"
                      role="progressbar"
                      aria-valuenow={Math.round(progress)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Queue progress: ${Math.round(progress)}%`}
                    >
                      <div className="progress-fill cyan" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-glass)',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                  }}>
                    📍 Assigned to Counter {q.counter}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Completed Queues */}
      {completedQueues.length > 0 && (
        <section aria-label="Queues ready — your turn">
          <div className="section-divider" role="separator">
            <span>Ready — Your Turn!</span>
          </div>
          <div className="cards-grid" id="completed-queues" role="list">
            {completedQueues.map((q) => (
              <article
                key={q.id}
                className="glass-card"
                style={{ borderColor: 'rgba(34,197,94,0.3)' }}
                role="listitem"
                aria-label={`Your turn at ${q.name}, go to Counter ${q.counter}`}
              >
                <div className="card-row">
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'var(--status-green-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <CheckCircle size={28} style={{ color: 'var(--status-green)' }} aria-hidden="true" />
                  </div>
                  <div className="card-info">
                    <h3 style={{ color: 'var(--status-green)' }}>Your Turn!</h3>
                    <p className="meta">{q.name} — Counter {q.counter}</p>
                  </div>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => removeQueue(q.id)}
                    aria-label={`Mark ${q.name} as done and dismiss`}
                  >
                    Done
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
