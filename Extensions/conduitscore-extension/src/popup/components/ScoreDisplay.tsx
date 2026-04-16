import type { ScoreData } from '../../shared/types';
import { gradeFromScore, formatScanDate } from '../../shared/utils';

interface ScoreDisplayProps {
  data: ScoreData;
}

function scoreColorClass(score: number): string {
  if (score >= 90) return 'grade-a';
  if (score >= 75) return 'grade-b';
  if (score >= 60) return 'grade-c';
  if (score >= 45) return 'grade-d';
  return 'grade-f';
}

export default function ScoreDisplay({ data }: ScoreDisplayProps) {
  const grade = gradeFromScore(data.score);
  const colorClass = scoreColorClass(data.score);

  return (
    <div className="score-card">
      <p className="score-domain">{data.domain}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', justifyContent: 'center' }}>
        <span className={`score-number ${colorClass}`}>{data.score}</span>
        <span className={`score-grade ${colorClass}`}>{grade}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
        <p className="score-date">Scanned {formatScanDate(data.scanned_at)}</p>
        {data.cache_hit && <span className="cached-pill">cached</span>}
      </div>
    </div>
  );
}
