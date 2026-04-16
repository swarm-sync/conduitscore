interface LoadingStateProps {
  domain: string;
}

export default function LoadingState({ domain }: LoadingStateProps) {
  return (
    <div className="loading-card" role="status" aria-label={`Scanning ${domain}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div className="spinner" aria-hidden="true" />
        <span style={{ fontSize: '14px', color: '#64748B' }}>
          Scanning {domain || '...'}
        </span>
      </div>
      <div className="skeleton-row" style={{ width: '100%' }} />
      <div className="skeleton-row" style={{ width: '75%' }} />
      <div className="skeleton-row" style={{ width: '85%' }} />
    </div>
  );
}
