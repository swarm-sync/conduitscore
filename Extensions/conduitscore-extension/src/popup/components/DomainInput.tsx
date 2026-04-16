import { useState, KeyboardEvent } from 'react';

interface DomainInputProps {
  value: string;
  onChange: (v: string) => void;
  onScan: () => void;
  loading: boolean;
}

export default function DomainInput({ value, onChange, onScan, loading }: DomainInputProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleChange(raw: string) {
    // Strip protocol automatically when pasted
    const stripped = raw.replace(/^https?:\/\//i, '');
    onChange(stripped);
    setValidationError(null);
  }

  function validate(input: string): string | null {
    const trimmed = input.trim();
    if (!trimmed) return 'Enter a domain like example.com';
    if (/https?:\/\//i.test(trimmed)) return 'Remove "http://" — enter domain only';
    if (trimmed.includes('/')) return 'Remove the path — enter domain only (no slashes)';
    if (/\s/.test(trimmed)) return 'Domain cannot contain spaces';
    return null;
  }

  function handleScan() {
    const err = validate(value);
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError(null);
    onScan();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleScan();
  }

  const hasError = validationError !== null;

  return (
    <div className="domain-input-wrapper">
      <label className="domain-input-label" htmlFor="domain-input">
        Domain
      </label>
      <input
        id="domain-input"
        type="text"
        className={`domain-input${hasError ? ' domain-input-error' : ''}`}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="example.com"
        aria-describedby={hasError ? 'domain-input-error-msg' : undefined}
        aria-invalid={hasError}
        disabled={loading}
        autoComplete="off"
        spellCheck={false}
      />
      {hasError && (
        <p id="domain-input-error-msg" className="domain-input-error" role="alert">
          {validationError}
        </p>
      )}
      <button
        className={loading ? 'btn-primary btn-disabled' : 'btn-primary'}
        onClick={handleScan}
        disabled={loading}
        type="button"
      >
        {loading ? 'Scanning...' : 'Scan Domain'}
      </button>
    </div>
  );
}
