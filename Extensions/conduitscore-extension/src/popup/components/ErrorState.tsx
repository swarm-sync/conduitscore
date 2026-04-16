import { useState, useEffect } from 'react';

interface ErrorStateProps {
  code: string;
  message: string;
  retryAfterSeconds?: number;
  onRateLimitExpired?: () => void;
}

const ERROR_HINTS: Record<string, string> = {
  invalid_domain: 'Enter a hostname like example.com — no http:// or slashes.',
  domain_not_found: 'This domain may not have been scanned yet. Try opening it on conduitscore.com.',
  rate_limited: 'The scan limit has been reached. Wait for the timer to expire.',
  network_error: 'Check your internet connection and try again.',
  server_error: 'ConduitScore is temporarily unavailable. Try again in a moment.',
  extension_error: 'Try reloading the extension from chrome://extensions.',
};

export default function ErrorState({ code, message, retryAfterSeconds, onRateLimitExpired }: ErrorStateProps) {
  const [secondsLeft, setSecondsLeft] = useState(retryAfterSeconds ?? 0);

  useEffect(() => {
    if (code !== 'rate_limited' || !retryAfterSeconds) return;
    setSecondsLeft(retryAfterSeconds);

    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          onRateLimitExpired?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [code, retryAfterSeconds, onRateLimitExpired]);

  const hint = ERROR_HINTS[code] ?? null;

  return (
    <div className="error-card" role="alert" aria-live="polite">
      <span className="error-icon" aria-hidden="true">⚠</span>
      <p className="error-message">{message}</p>
      {hint && <p className="error-hint">{hint}</p>}
      {code === 'rate_limited' && retryAfterSeconds != null && secondsLeft > 0 && (
        <p className="countdown">
          Try again in <strong>{secondsLeft}s</strong>
        </p>
      )}
    </div>
  );
}
