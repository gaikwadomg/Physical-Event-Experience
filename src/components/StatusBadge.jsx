import { getCrowdStatus } from '../data/stadiumData';

/**
 * StatusBadge — displays a color-coded crowd level indicator.
 * @param {{ crowdLevel: number }} props
 */
export default function StatusBadge({ crowdLevel }) {
  const status = getCrowdStatus(crowdLevel);

  return (
    <span
      className={`badge badge-${status.color}`}
      role="status"
      aria-label={`Crowd level: ${status.label}, ${crowdLevel}%`}
    >
      <span aria-hidden="true">{status.emoji}</span> {status.label} ({crowdLevel}%)
    </span>
  );
}
