import { useStadium } from '../context/StadiumContext';
import StatusBadge from '../components/StatusBadge';
import { getCrowdStatus } from '../data/stadiumData';
import { Compass, Zap, Shield, ChevronRight, UtensilsCrossed, Bath } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { gates, entered, enterStadium } = useStadium();
  const navigate = useNavigate();

  const bestGate = gates.reduce((a, b) => a.crowdLevel < b.crowdLevel ? a : b);

  return (
    <div className="page-enter" role="region" aria-label="Home — Smart Stadium">
      {/* Hero */}
      <header className="page-header text-center" style={{ paddingTop: '32px' }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '8px',
          filter: 'drop-shadow(0 0 20px rgba(0,212,255,0.3))',
        }}
          aria-hidden="true"
        >
          🏟️
        </div>
        <h1 style={{
          background: 'var(--accent-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '1.8rem',
        }}>
          Smart Stadium
        </h1>
        <p style={{ marginTop: '4px' }}>Your live event companion</p>

        <div className="live-indicator" style={{ justifyContent: 'center', marginTop: '16px' }}
          role="status" aria-live="polite"
        >
          <span className="live-dot" aria-hidden="true" />
          <span>Live — IPL Final 2026</span>
        </div>
      </header>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '12px',
        margin: '24px 0',
      }}
        role="region"
        aria-label="Event statistics"
      >
        {[
          { icon: '👥', value: '45K', label: 'Attendance' },
          { icon: '🌡️', value: '28°C', label: 'Weather' },
          { icon: '⏱️', value: 'Q2', label: 'Match Half' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card" style={{
            padding: '14px',
            textAlign: 'center',
          }}
            aria-label={`${stat.label}: ${stat.value}`}
          >
            <div style={{ fontSize: '1.3rem', marginBottom: '4px' }} aria-hidden="true">{stat.icon}</div>
            <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{stat.value}</div>
            <div className="text-xs text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Enter Stadium */}
      {!entered && (
        <button
          id="enter-stadium-btn"
          className="btn btn-primary btn-full"
          style={{ padding: '16px', fontSize: '1rem', marginBottom: '24px' }}
          onClick={() => enterStadium()}
          aria-label="Enter stadium and find the best gate"
        >
          <Zap size={20} aria-hidden="true" />
          Enter Stadium — Find Best Gate
        </button>
      )}

      {/* Gate Cards */}
      <div className="section-divider" role="separator">
        <span>Entry Gates</span>
      </div>

      <div className="cards-grid stagger-children" id="gates-list" role="list" aria-label="Stadium entry gates">
        {gates.map((gate) => {
          const isBest = gate.id === bestGate.id;
          const status = getCrowdStatus(gate.crowdLevel);

          return (
            <article
              key={gate.id}
              className={`glass-card ${isBest ? 'recommended' : ''}`}
              id={`gate-${gate.id}`}
              role="listitem"
              aria-label={`${gate.name} — ${status.label}, ${gate.crowdLevel}% crowded${isBest ? ', recommended' : ''}`}
            >
              <div className="card-row">
                <div style={{
                  width: 48, height: 48,
                  borderRadius: 'var(--radius-md)',
                  background: `var(--status-${status.color}-bg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', flexShrink: 0,
                }} aria-hidden="true">
                  {gate.icon}
                </div>
                <div className="card-info">
                  <h3>{gate.name}</h3>
                  <StatusBadge crowdLevel={gate.crowdLevel} />
                </div>
                {isBest && (
                  <ChevronRight size={20} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} aria-hidden="true" />
                )}
              </div>
              <div className="progress-bar" style={{ marginTop: '12px' }}
                role="progressbar" aria-valuenow={gate.crowdLevel} aria-valuemin={0} aria-valuemax={100}
                aria-label={`Crowd level: ${gate.crowdLevel}%`}
              >
                <div
                  className={`progress-fill ${status.color}`}
                  style={{ width: `${gate.crowdLevel}%` }}
                />
              </div>
            </article>
          );
        })}
      </div>

      {/* Quick Actions — FIX: visible text, accessible buttons */}
      <div className="section-divider" style={{ marginTop: '28px' }} role="separator">
        <span>Quick Actions</span>
      </div>

      <nav aria-label="Quick actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {[
          { icon: <Compass size={22} aria-hidden="true" />, label: 'Navigate', desc: 'Find routes', to: '/navigate', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.12)' },
          { icon: <UtensilsCrossed size={22} aria-hidden="true" />, label: 'Food', desc: 'Order food', to: '/food', color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.12)' },
          { icon: <Bath size={22} aria-hidden="true" />, label: 'Washroom', desc: 'Book slot', to: '/washroom', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.12)' },
          { icon: <Shield size={22} aria-hidden="true" />, label: 'Emergency', desc: 'Safe exits', to: '/emergency', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.12)' },
        ].map((action) => (
          <button
            key={action.label}
            className="quick-action-card"
            id={`quick-${action.label.toLowerCase()}`}
            style={{
              border: `1px solid ${action.color}33`,
            }}
            onClick={() => navigate(action.to)}
            aria-label={`${action.label} — ${action.desc}`}
          >
            <div className="quick-action-icon" style={{
              color: action.color,
              background: action.bgColor,
            }}>
              {action.icon}
            </div>
            <div className="quick-action-label">{action.label}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {action.desc}
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}
