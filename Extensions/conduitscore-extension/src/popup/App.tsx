import { useState, useEffect, useCallback } from 'react';
import type { ScoreData } from '../shared/types';
import DomainInput from './components/DomainInput';
import ScoreDisplay from './components/ScoreDisplay';
import CategoryRow from './components/CategoryRow';
import ErrorState from './components/ErrorState';
import LoadingState from './components/LoadingState';

type ViewState = 'idle' | 'loading' | 'results' | 'error';

export default function App() {
  const [domain, setDomain] = useState('');
  const [viewState, setViewState] = useState<ViewState>('idle');
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [error, setError] = useState<{ code: string; message: string; retryAfterSeconds?: number } | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showScanInput, setShowScanInput] = useState(false);

  // Auto-populate domain from active tab on mount, then check for pending context scan
  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'GET_ACTIVE_TAB_DOMAIN' }, (response) => {
      if (response?.success && response.domain) {
        setDomain(response.domain as string);
      }
    });

    // §6.3: load pending context scan result if present and within 30s
    chrome.storage.local.get('pending_context_scan', (result) => {
      const pending = result['pending_context_scan'] as
        | { domain: string; data: ScoreData; triggered_at: number }
        | undefined;
      if (pending && Date.now() - pending.triggered_at < 30_000) {
        setScoreData(pending.data);
        setDomain(pending.domain);
        setViewState('results');
        chrome.storage.local.remove('pending_context_scan');
      }
    });
  }, []);

  const handleScan = useCallback(
    (domainToScan: string, forceRefresh = false) => {
      setViewState('loading');
      setError(null);

      chrome.runtime.sendMessage(
        {
          type: 'SCAN_DOMAIN',
          domain: domainToScan,
          force_refresh: forceRefresh,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            setViewState('error');
            setError({
              code: 'extension_error',
              message: 'Extension communication error. Reload the extension.',
            });
            return;
          }
          if (response.success) {
            setScoreData(response.data as ScoreData);
            setViewState('results');
            setShowScanInput(false);
          } else {
            setError({
              code: response.error as string,
              message: response.message as string,
              retryAfterSeconds: response.retry_after_seconds as number | undefined,
            });
            setViewState('error');
          }
        }
      );
    },
    []
  );

  const handleRefresh = useCallback(() => {
    if (scoreData?.domain) {
      handleScan(scoreData.domain, true);
    }
  }, [scoreData, handleScan]);

  const handleOpenInApp = useCallback(() => {
    if (scoreData?.domain) {
      chrome.tabs.create({
        url: `https://conduitscore.com/domain/${encodeURIComponent(scoreData.domain)}`,
      });
    }
  }, [scoreData]);

  return (
    <div className="popup-root">
      <header className="popup-header">
        <div className="popup-logo">
          <img src="icons/icon-32.png" alt="" width={20} height={20} />
          <span>ConduitScore</span>
        </div>
        <a
          href="https://conduitscore.com/docs/extension"
          target="_blank"
          rel="noreferrer"
          className="help-link"
          aria-label="Extension help"
        >
          ?
        </a>
      </header>

      {(viewState === 'idle' || (viewState === 'error' && !error)) && (
        <DomainInput
          value={domain}
          onChange={setDomain}
          onScan={() => handleScan(domain)}
          loading={false}
        />
      )}

      {viewState === 'loading' && <LoadingState domain={domain} />}

      {viewState === 'results' && scoreData && (
        <>
          <ScoreDisplay data={scoreData} />
          <section className="categories-section">
            <p className="section-label">Categories</p>
            {Object.entries(scoreData.categories).map(([key, cat]) => (
              <CategoryRow
                key={key}
                categoryKey={key}
                category={cat}
                expanded={expandedCategory === key}
                onToggle={() =>
                  setExpandedCategory(expandedCategory === key ? null : key)
                }
              />
            ))}
          </section>
          <div className="action-row">
            <button className="btn-secondary" onClick={handleRefresh}>
              Refresh
            </button>
            <button className="btn-primary" onClick={handleOpenInApp}>
              Open in ConduitScore
            </button>
          </div>
          <button
            className="scan-different-toggle"
            onClick={() => setShowScanInput(!showScanInput)}
          >
            Scan different domain {showScanInput ? '▲' : '▼'}
          </button>
          {showScanInput && (
            <DomainInput
              value={domain}
              onChange={setDomain}
              onScan={() => handleScan(domain)}
              loading={false}
            />
          )}
        </>
      )}

      {viewState === 'error' && error && (
        <>
          <DomainInput
            value={domain}
            onChange={setDomain}
            onScan={() => handleScan(domain)}
            loading={false}
          />
          <ErrorState
            code={error.code}
            message={error.message}
            retryAfterSeconds={error.retryAfterSeconds}
            onRateLimitExpired={() => setViewState('idle')}
          />
        </>
      )}
    </div>
  );
}
