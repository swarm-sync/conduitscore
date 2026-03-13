import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", style, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)", letterSpacing: "0.01em" }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`rounded-[var(--radius-md)] text-sm outline-none transition-all ${className}`}
          style={{
            background: "var(--surface-sunken)",
            border: error ? "1px solid var(--error-500)" : "1px solid var(--border-subtle)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
            fontSize: "0.9375rem",
            padding: "11px 16px",
            width: "100%",
            caretColor: "var(--cyan-400)",
            boxShadow: error ? `0 0 0 3px var(--error-glow)` : undefined,
            ...style,
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = "var(--violet-500)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(108,59,255,0.15), 0 0 12px rgba(108,59,255,0.08)";
            }
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.boxShadow = error ? "0 0 0 3px var(--error-glow)" : "none";
            }
            props.onBlur?.(e);
          }}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {hint}
          </p>
        )}
        {error && (
          <p
            id={`${inputId}-error`}
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "var(--error-400)" }}
            role="alert"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.25" />
              <path d="M6 3.5v2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              <circle cx="6" cy="8.5" r="0.6" fill="currentColor" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
