import { useStadium } from '../context/StadiumContext';
import { useNavigate } from 'react-router-dom';
import { getCrowdStatus } from '../data/stadiumData';
import { MapPin, Users, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WashroomPage() {
  const { washrooms, joinQueue, queues } = useStadium();
  const navigate = useNavigate();

  const bestWashroom = washrooms.reduce(
    (a, b) => a.waitTime < b.waitTime ? a : b,
    washrooms[0]
  );

  const handleBookSlot = (wc) => {
    const queueId = `wc-${wc.id}`;
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
      type: 'washroom',
      name: `Washroom — ${wc.zone}`,
      icon: '🚻',
      position: wc.queueLength,
    });

    toast.success(`Slot booked at ${wc.zone}!`, {
      icon: '🚻',
      style: {
        background: '#0d1117', color: '#e6edf3',
        border: '1px solid rgba(255,255,255,0.1)',
      },
    });

    // Reminder toast after a short delay
    if (wc.waitTime > 0) {
      setTimeout(() => {
        toast('⏰ Your washroom turn is coming up soon!', {
          icon: '🚻',
          duration: 5000,
          style: {
            background: '#0d1117', color: '#e6edf3',
            border: '1px solid rgba(0,212,255,0.3)',
          },
        });
      }, 5000);
    }

    navigate('/queue');
  };

  return (
    <div className="page-enter" role="region" aria-label="Washroom Booking">
      <header className="page-header">
        <div className="page-icon" aria-hidden="true">🚻</div>
        <h1>Washroom Booking</h1>
        <p>Book a slot and skip the line</p>
      </header>

      {/* Best Option Banner */}
      <div className="glass-card" style={{
        marginBottom: '20px',
        borderColor: 'rgba(34, 197, 94, 0.3)',
        background: 'rgba(34, 197, 94, 0.06)',
      }}
        role="alert"
      >
        <div className="flex items-center gap-sm">
          <MapPin size={18} style={{ color: 'var(--status-green)' }} aria-hidden="true" />
          <div>
            <h4 style={{ color: 'var(--status-green)' }}>Nearest & Fastest</h4>
            <p style={{ fontSize: '0.8rem' }}>
              👉 <strong style={{ color: 'var(--text-primary)' }}>{bestWashroom.zone}</strong> — only{' '}
              {bestWashroom.waitTime} min wait ({bestWashroom.distance})
            </p>
          </div>
        </div>
      </div>

      <div className="live-indicator" style={{ marginBottom: '16px' }}
        role="status" aria-live="polite"
      >
        <span className="live-dot" aria-hidden="true" />
        <span>Availability updating live</span>
      </div>

      {/* Washroom Cards */}
      <div className="cards-grid stagger-children" id="washroom-list" role="list"
        aria-label="Washroom zones"
      >
        {washrooms.map((wc) => {
          const isBest = wc.id === bestWashroom.id;
          const isAvailable = wc.queueLength <= 2;

          return (
            <article
              key={wc.id}
              className={`glass-card ${isBest ? 'recommended' : ''}`}
              id={`washroom-${wc.id}`}
              role="listitem"
              aria-label={`${wc.zone}, ${wc.distance}, ${wc.queueLength} in queue, ${wc.waitTime} min wait${isBest ? ', recommended' : ''}`}
            >
              <div className="card-row">
                <div style={{
                  width: 48, height: 48,
                  borderRadius: 'var(--radius-md)',
                  background: isAvailable
                    ? 'var(--status-green-bg)'
                    : 'var(--status-yellow-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', flexShrink: 0,
                  position: 'relative',
                }} aria-hidden="true">
                  {wc.icon}
                  {/* Availability dot */}
                  <span
                    style={{
                      position: 'absolute', top: 4, right: 4,
                      width: 8, height: 8, borderRadius: '50%',
                      background: isAvailable ? 'var(--status-green)' : 'var(--status-yellow)',
                      boxShadow: isAvailable ? 'var(--status-green-glow)' : 'none',
                    }}
                    aria-hidden="true"
                  />
                </div>
                <div className="card-info">
                  <h3>{wc.zone}</h3>
                  <p className="meta">{wc.distance}</p>
                </div>
                <span className="sr-only">
                  {isAvailable ? 'Available now' : 'Moderate queue'}
                </span>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-md" style={{ marginTop: '14px' }}>
                <div className="flex items-center gap-sm text-sm">
                  <Users size={14} className="text-muted" aria-hidden="true" />
                  <span style={{ fontWeight: 600 }}>{wc.queueLength} in queue</span>
                </div>
                <div className="flex items-center gap-sm text-sm">
                  <Clock size={14} className="text-muted" aria-hidden="true" />
                  <span style={{
                    fontWeight: 600,
                    color: wc.waitTime <= 3
                      ? 'var(--status-green)'
                      : wc.waitTime <= 8
                        ? 'var(--status-yellow)'
                        : 'var(--status-red)',
                  }}>
                    {wc.waitTime} min wait
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <button
                className={`btn ${isBest ? 'btn-primary' : 'btn-secondary'} btn-sm btn-full`}
                style={{ marginTop: '14px' }}
                onClick={() => handleBookSlot(wc)}
                id={`book-wc-${wc.id}`}
                aria-label={`Book slot at ${wc.zone} washroom`}
              >
                🎫 Book Slot
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
