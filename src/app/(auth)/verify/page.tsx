import Link from "next/link";
import Image from "next/image";

export default function VerifyPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0c0c0e",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
          padding: "48px 32px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
        }}
      >
        <Link href="/" style={{ display: "inline-block", marginBottom: "32px" }}>
          <Image src="/logo.svg" alt="ConduitScore" width={140} height={32} priority />
        </Link>

        <div
          style={{
            width: "64px",
            height: "64px",
            background: "rgba(108,59,255,0.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <svg
            style={{ width: "28px", height: "28px", color: "#6c3bff" }}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>

        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#ffffff",
            margin: "0 0 12px",
            fontFamily: "sans-serif",
          }}
        >
          Check your email
        </h1>

        <p
          style={{
            color: "#a0a0b0",
            fontSize: "15px",
            lineHeight: 1.6,
            margin: "0 0 32px",
            fontFamily: "sans-serif",
          }}
        >
          A sign-in link has been sent to your email address. Click the link to
          sign in to ConduitScore — it expires in 24 hours.
        </p>

        <p
          style={{
            color: "#606070",
            fontSize: "13px",
            fontFamily: "sans-serif",
            margin: 0,
          }}
        >
          Didn&apos;t receive an email?{" "}
          <Link
            href="/signin"
            style={{ color: "#6c3bff", textDecoration: "none" }}
          >
            Try again
          </Link>
        </p>
      </div>
    </div>
  );
}
