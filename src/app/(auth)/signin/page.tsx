"use client";

import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const BRAND_LOGO_SRC = "/logo.svg";

function SignInContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const searchParams = useSearchParams();
  const callbackParam = searchParams.get("callbackUrl");
  const callbackUrl = callbackParam?.startsWith("/") ? callbackParam : "/dashboard";

  const handleGoogle = () => {
    signIn("google", { callbackUrl });
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("email", { email, callbackUrl, redirect: false });
    setLoading(false);
    setSent(true);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--surface-base)" }}
    >
      {/* Background mesh */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(108,59,255,0.18) 0%, rgba(0,217,255,0.04) 50%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none hero-grid"
        style={{ opacity: 0.5 }}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-sm rounded-2xl p-8"
        style={{
          background: "var(--surface-overlay)",
          border: "1px solid var(--border-default)",
          boxShadow: "var(--shadow-raised), 0 0 60px rgba(108,59,255,0.08)",
        }}
        role="region"
        aria-labelledby="signin-heading"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src={BRAND_LOGO_SRC}
              alt="ConduitScore"
              width={120}
              height={46}
              priority
              style={{
                width: "auto",
                height: "46px",
                display: "block",
                mixBlendMode: "darken",
              }}
            />
          </div>
          <h1
            id="signin-heading"
            className="text-lg font-bold leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              display: "block",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            Sign in to{" "}
            <span
              style={{
                background: "var(--gradient-primary)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
              }}
            >
              ConduitScore
            </span>
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: "var(--text-tertiary)" }}>
            Access your AI visibility dashboard
          </p>
        </div>

        {sent ? (
          /* Success state */
          <div
            className="rounded-xl p-5 text-center"
            style={{
              background: "rgba(0,229,160,0.06)",
              border: "1px solid rgba(0,229,160,0.20)",
            }}
            role="alert"
            aria-live="polite"
          >
            <div className="flex justify-center mb-3" aria-hidden="true">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  background: "rgba(0,229,160,0.10)",
                  border: "1px solid rgba(0,229,160,0.22)",
                  boxShadow: "0 0 20px rgba(0,229,160,0.15)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10l4.5 4.5 7.5-9" stroke="var(--success-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-semibold" style={{ color: "var(--success-400)", fontFamily: "var(--font-display)" }}>
              Magic link sent!
            </p>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              Check your email at{" "}
              <strong style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "0.8125rem" }}>
                {email}
              </strong>{" "}
              to sign in.
            </p>
          </div>
        ) : (
          <>
            {/* Google OAuth */}
            <button
              onClick={handleGoogle}
              className="flex w-full items-center justify-center gap-3 rounded-[var(--radius-md)] py-3 text-sm font-medium transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-default)",
                fontFamily: "var(--font-body)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "var(--border-default)";
              }}
              aria-label="Sign in with Google"
            >
              <svg className="flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3" aria-hidden="true">
              <div className="h-px flex-1" style={{ background: "var(--border-subtle)" }} />
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>or</span>
              <div className="h-px flex-1" style={{ background: "var(--border-subtle)" }} />
            </div>

            {/* Magic Link form */}
            <form onSubmit={handleEmail} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="email-input"
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Email address
                </label>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-[var(--radius-md)] text-sm outline-none transition-all"
                  style={{
                    background: "var(--surface-sunken)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                    padding: "11px 14px",
                    fontFamily: "var(--font-body)",
                    caretColor: "var(--cyan-400)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--violet-500)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(108,59,255,0.15), 0 0 12px rgba(108,59,255,0.08)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[var(--radius-md)] py-3 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #6C3BFF 0%, #00D9FF 100%)",
                  color: "#fff",
                  boxShadow: "0 2px 12px rgba(108,59,255,0.50), 0 0 20px rgba(0,217,255,0.10)",
                  fontFamily: "var(--font-body)",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow =
                      "0 4px 24px rgba(108,59,255,0.65), 0 0 40px rgba(0,217,255,0.18)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 2px 12px rgba(108,59,255,0.50), 0 0 20px rgba(0,217,255,0.10)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2 justify-center">
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                      <path d="M7 2a5 5 0 0 1 5 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Magic Link"
                )}
              </button>
            </form>
          </>
        )}

        {/* Back to home */}
        <p className="mt-6 text-center text-xs" style={{ color: "var(--text-tertiary)" }}>
          <Link
            href="/"
            className="inline-flex items-center gap-1 transition-colors"
            style={{ color: "var(--cyan-400)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cyan-300)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cyan-400)")}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to ConduitScore
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  );
}
