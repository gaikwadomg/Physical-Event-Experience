import { useStadium } from '../context/StadiumContext';
import StatusBadge from '../components/StatusBadge';
import { getCrowdStatus } from '../data/stadiumData';
import { AlertTriangle, Phone, Shield, ChevronRight } from 'lucide-react';

export default function EmergencyPage() {
  const { emergencyExits, isEmergency, toggleEmergency } = useStadium();

  const safestExit = emergencyExits.reduce(
    (a, b) => a.crowdLevel < b.crowdLevel ? a : b,
    emergencyExits[0]
  );

  return (
    <div className={`page-enter ${isEmergency ? 'emergency-overlay' : ''}`}
      role="region" aria-label="Emergency information"
    >
      <header className="page-header">
        <div className="page-icon" aria-hidden="true">🚨</div>
        <h1 style={{ color: 'var(--status-red)' }}>Emergency</h1>
        <p>Stay calm — follow the safest route</p>
      </header>

      {/* Emergency Toggle */}
      <button
        className={`btn ${isEmergency ? 'btn-secondary' : 'btn-danger'} btn-full`}
        style={{
          padding: '18px',
          fontSize: '1rem',
          marginBottom: '24px',
          ...(isEmergency && {
            borderColor: 'rgba(34,197,94,0.3)',
            color: 'var(--status-green)',
          }),
        }}
        onClick={toggleEmergency}
        id="emergency-toggle-btn"
        aria-label={isEmergency ? 'Cancel emergency mode' : 'Activate emergency mode'}
        aria-pressed={isEmergency}
      >
        <AlertTriangle size={22} aria-hidden="true" />
        {isEmergency ? '✅ Cancel Emergency' : '🚨 Activate Emergency Mode'}
      </button>

      {/* Safest Exit Banner */}
      <div className={`glass-card ${isEmergency ? 'emergency-active' : ''}`} style={{
        marginBottom: '20px',
        borderColor: isEmergency ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.3)',
        background: isEmergency ? 'rgba(239,68,68,0.06)' : 'rgba(34,197,94,0.06)',
      }}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center gap-sm">
          <Shield size={20} style={{ color: isEmergency ? 'var(--status-red)' : 'var(--status-green)' }} aria-hidden="true" />
          <div>
            <h4 style={{ color: isEmergency ? 'var(--status-red)' : 'var(--status-green)' }}>
              {isEmergency ? '⚡ USE THIS EXIT NOW' : 'Safest Exit'}
            </h4>
            <p style={{ fontSize: '0.85rem' }}>
              👉 <strong style={{ color: 'var(--text-primary)' }}>{safestExit.name}</strong>{' '}
              — {safestExit.distance} away, least crowded
            </p>
          </div>
        </div>
      </div>

      {/* All Exits */}
      <div className="section-divider" role="separator">
        <span>All Emergency Exits</span>
      </div>

      <div className="cards-grid stagger-children" id="exits-list" role="list"
        aria-label="Emergency exits"
      >
        {emergencyExits.map((exit) => {
          const isSafest = exit.id === safestExit.id;
          const status = getCrowdStatus(exit.crowdLevel);

          return (
            <article
              key={exit.id}
              className={`glass-card ${isSafest ? 'recommended' : ''} ${isEmergency && isSafest ? 'emergency-active' : ''}`}
              id={`exit-${exit.id}`}
              style={isSafest && isEmergency ? { borderColor: 'rgba(34,197,94,0.4)' } : {}}
              role="listitem"
              aria-label={`${exit.name}, ${exit.distance} away, ${status.label}${isSafest ? ', safest option' : ''}`}
            >
              <div className="card-row">
                <div style={{
                  width: 48, height: 48,
                  borderRadius: 'var(--radius-md)',
                  background: isSafest ? 'var(--status-green-bg)' : `var(--status-${status.color}-bg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem', flexShrink: 0,
                }} aria-hidden="true">
                  {exit.icon}
                </div>
                <div className="card-info">
                  <h3>{exit.name}</h3>
                  <div className="flex items-center gap-sm mt-sm">
                    <span className="text-xs text-muted">📏 {exit.distance}</span>
                    <StatusBadge crowdLevel={exit.crowdLevel} />
                  </div>
                </div>
                {isSafest && (
                  <ChevronRight size={20} style={{ color: 'var(--status-green)', flexShrink: 0 }} aria-hidden="true" />
                )}
              </div>
              <div className="progress-bar" style={{ marginTop: '12px' }}
                role="progressbar" aria-valuenow={exit.crowdLevel} aria-valuemin={0} aria-valuemax={100}
                aria-label={`Crowd level: ${exit.crowdLevel}%`}
              >
                <div
                  className={`progress-fill ${status.color}`}
                  style={{ width: `${exit.crowdLevel}%` }}
                />
              </div>
            </article>
          );
        })}
      </div>

      {/* Emergency Contacts */}
      <div className="section-divider" role="separator">
        <span>Emergency Contacts</span>
      </div>

      <div className="cards-grid" role="list" aria-label="Emergency contact numbers">
        {[
          { label: 'Stadium Security', number: '100', icon: '🛡️' },
          { label: 'Medical Help', number: '108', icon: '🏥' },
          { label: 'Fire Emergency', number: '101', icon: '🚒' },
        ].map((contact) => (
          <div key={contact.label} className="glass-card" style={{ padding: '16px' }}
            role="listitem"
          >
            <div className="card-row">
              <span style={{ fontSize: '1.3rem' }} aria-hidden="true">{contact.icon}</span>
              <div className="card-info">
                <h4>{contact.label}</h4>
                <p className="meta">{contact.number}</p>
              </div>
              <a
                href={`tel:${contact.number}`}
                className="btn btn-secondary btn-sm"
                style={{ padding: '8px' }}
                aria-label={`Call ${contact.label} at ${contact.number}`}
              >
                <Phone size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
