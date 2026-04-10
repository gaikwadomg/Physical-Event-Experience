import { NavLink } from 'react-router-dom';
import { Home, Compass, UtensilsCrossed, Clock, AlertTriangle, Gamepad2 } from 'lucide-react';
import { useStadium } from '../context/StadiumContext';

const navItems = [
  { to: '/', icon: Home, label: 'Home', ariaLabel: 'Home page' },
  { to: '/navigate', icon: Compass, label: 'Navigate', ariaLabel: 'Smart navigation' },
  { to: '/food', icon: UtensilsCrossed, label: 'Food', ariaLabel: 'Food stalls and ordering' },
  { to: '/queue', icon: Clock, label: 'Queues', ariaLabel: 'My active queues' },
  { to: '/game', icon: Gamepad2, label: 'Play', ariaLabel: 'Games and rewards' },
];

export default function Navbar() {
  const { isEmergency, queues } = useStadium();
  const activeQueues = queues.filter(q => q.position > 0).length;

  return (
    <nav className="bottom-nav" id="main-navbar" role="navigation" aria-label="Main navigation">
      <div className="bottom-nav-inner">
        {navItems.map(({ to, icon: Icon, label, ariaLabel }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            id={`nav-${label.toLowerCase()}`}
            aria-label={ariaLabel}
            aria-current={undefined} // React Router handles this
          >
            <Icon className="nav-icon" size={22} aria-hidden="true" />
            <span>{label}</span>
            {label === 'Queues' && activeQueues > 0 && (
              <span
                aria-label={`${activeQueues} active queues`}
                style={{
                  position: 'absolute', top: 2, right: 2,
                  width: 16, height: 16, borderRadius: '50%',
                  background: 'var(--accent-gradient)', fontSize: '0.6rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, color: 'white',
                }}
              >
                {activeQueues}
              </span>
            )}
          </NavLink>
        ))}
        <NavLink
          to="/emergency"
          className={({ isActive }) =>
            `nav-item emergency-nav ${isActive ? 'active' : ''} ${isEmergency ? 'pulse' : ''}`
          }
          id="nav-emergency"
          aria-label="Emergency mode and safe exits"
        >
          <AlertTriangle className="nav-icon" size={22} aria-hidden="true" />
          <span>SOS</span>
        </NavLink>
      </div>
    </nav>
  );
}
