import { useState } from 'react';
import { useStadium } from '../context/StadiumContext';
import StatusBadge from '../components/StatusBadge';
import { getCrowdStatus } from '../data/stadiumData';
import { destinations } from '../data/stadiumData';
import { Compass, ArrowRight } from 'lucide-react';

export default function NavigationPage() {
  const { routes } = useStadium();
  const [selected, setSelected] = useState('seat');

  const currentRoutes = routes[selected] || [];
  const bestRoute = currentRoutes.reduce(
    (a, b) => a.crowdLevel < b.crowdLevel ? a : b,
    currentRoutes[0]
  );

  return (
    <div className="page-enter" role="region" aria-label="Smart Navigation">
      <header className="page-header">
        <div className="page-icon" aria-hidden="true">🧭</div>
        <h1>Smart Navigation</h1>
        <p>Find the fastest route to your destination</p>
      </header>

      {/* Stadium Floor Map — Static venue layout image */}
      <div className="map-embed" aria-label="Stadium floor plan">
        <img
          src="/stadium-map.png"
          alt="The Entertainment Complex — Floor Level 1 showing cinema halls, theater, esports arena, food court, lounges, and all venue areas"
          className="map-static-image"
          loading="lazy"
        />
      </div>

      {/* Destination Picker */}
      <div className="flex gap-sm" style={{ flexWrap: 'wrap', marginTop: '20px', marginBottom: '20px' }}
        role="radiogroup" aria-label="Choose destination"
      >
        {destinations.map((dest) => (
          <button
            key={dest.id}
            className={`chip ${selected === dest.id ? 'active' : ''}`}
            onClick={() => setSelected(dest.id)}
            id={`dest-${dest.id}`}
            role="radio"
            aria-checked={selected === dest.id}
            aria-label={`Destination: ${dest.label}`}
          >
            <span aria-hidden="true">{dest.icon}</span> {dest.label}
          </button>
        ))}
      </div>

      {/* Live indicator */}
      <div className="live-indicator" style={{ marginBottom: '16px' }}
        role="status" aria-live="polite"
      >
        <span className="live-dot" aria-hidden="true" />
        <span>Routes updating live</span>
      </div>

      {/* Route Cards */}
      <div className="cards-grid stagger-children" id="routes-list" role="list"
        aria-label={`Routes to ${destinations.find(d => d.id === selected)?.label}`}
      >
        {currentRoutes.map((route) => {
          const isBest = route.id === bestRoute?.id;
          const status = getCrowdStatus(route.crowdLevel);

          return (
            <article
              key={route.id}
              className={`glass-card ${isBest ? 'recommended' : ''}`}
              id={`route-${route.id}`}
              role="listitem"
              aria-label={`${route.name}, walk time ${route.walkTime}, ${status.label}${isBest ? ', recommended' : ''}`}
            >
              <div className="card-row">
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: `var(--status-${status.color}-bg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }} aria-hidden="true">
                  <Compass size={20} style={{ color: `var(--status-${status.color})` }} />
                </div>
                <div className="card-info">
                  <h4>{route.name}</h4>
                  <div className="flex items-center gap-sm mt-sm">
                    <span className="text-xs text-muted">🕐 {route.walkTime}</span>
                    <StatusBadge crowdLevel={route.crowdLevel} />
                  </div>
                </div>
                {isBest && (
                  <ArrowRight size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} aria-hidden="true" />
                )}
              </div>

              {/* Crowd Meter */}
              <div className="progress-bar" style={{ marginTop: '12px' }}
                role="progressbar" aria-valuenow={route.crowdLevel} aria-valuemin={0} aria-valuemax={100}
                aria-label={`Crowd level: ${route.crowdLevel}%`}
              >
                <div
                  className={`progress-fill ${status.color}`}
                  style={{ width: `${route.crowdLevel}%` }}
                />
              </div>

              {isBest && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0, 212, 255, 0.06)',
                  border: '1px solid rgba(0, 212, 255, 0.15)',
                  fontSize: '0.78rem',
                  color: 'var(--accent-cyan)',
                }}>
                  👉 Take this route for fastest access
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
