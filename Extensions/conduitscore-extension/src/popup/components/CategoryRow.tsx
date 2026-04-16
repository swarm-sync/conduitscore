import type { CategoryScore } from '../../shared/types';

const CATEGORY_LABELS: Record<string, string> = {
  ssl: 'SSL Certificate',
  redirects: 'Redirect Chain',
  headers: 'Security Headers',
  performance: 'Performance',
  accessibility: 'Accessibility',
};

interface CategoryRowProps {
  categoryKey: string;
  category: CategoryScore;
  expanded: boolean;
  onToggle: () => void;
}

export default function CategoryRow({ categoryKey, category, expanded, onToggle }: CategoryRowProps) {
  const label = CATEGORY_LABELS[categoryKey] ?? categoryKey;

  return (
    <div
      className={`category-row${expanded ? ' category-row-expanded' : ''}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="category-label">{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`category-score ${category.passed ? 'grade-b' : 'grade-f'}`}>
            {category.score}
          </span>
          {category.passed
            ? <span className="pass-icon" aria-label="Passed">✓</span>
            : <span className="fail-icon" aria-label="Failed">✗</span>
          }
          <span className={`chevron${expanded ? ' chevron-open' : ''}`} aria-hidden="true">›</span>
        </div>
      </div>
      {expanded && category.findings.length > 0 && (
        <ul className="category-findings">
          {category.findings.map((finding, i) => (
            <li key={i}>{finding}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
