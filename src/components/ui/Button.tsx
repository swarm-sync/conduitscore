import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?:    ButtonSize;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, #6C3BFF 0%, #00D9FF 100%)",
    color: "#ffffff",
    boxShadow: "0 2px 12px rgba(108,59,255,0.50), 0 0 20px rgba(0,217,255,0.10)",
    border: "none",
  },
  secondary: {
    background: "rgba(108, 59, 255, 0.08)",
    color: "var(--violet-300)",
    border: "1px solid var(--border-default)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid transparent",
  },
  danger: {
    background: "rgba(255, 71, 87, 0.10)",
    color: "var(--error-400)",
    border: "1px solid rgba(255, 71, 87, 0.28)",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "6px 14px",  fontSize: "0.8125rem", borderRadius: "var(--radius-sm)" },
  md: { padding: "11px 22px", fontSize: "0.9rem",    borderRadius: "var(--radius-md)" },
  lg: { padding: "14px 30px", fontSize: "1rem",      borderRadius: "var(--radius-lg)" },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", style, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 font-semibold transition-all focus:outline-none disabled:opacity-38 disabled:cursor-not-allowed ${className}`}
        style={{
          fontFamily: "var(--font-body)",
          letterSpacing: "0.005em",
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...style,
        }}
        onMouseEnter={(e) => {
          if (!props.disabled) {
            const el = e.currentTarget;
            if (variant === "primary") {
              el.style.boxShadow = "0 4px 24px rgba(108,59,255,0.65), 0 0 40px rgba(0,217,255,0.18)";
              el.style.transform = "translateY(-1px) scale(1.02)";
            } else if (variant === "secondary") {
              el.style.background = "rgba(108, 59, 255, 0.16)";
              el.style.borderColor = "rgba(108,59,255,0.50)";
              el.style.color = "var(--violet-200)";
              el.style.boxShadow = "0 0 20px rgba(108,59,255,0.15)";
              el.style.transform = "translateY(-1px)";
            } else if (variant === "ghost") {
              el.style.background = "rgba(255,255,255,0.05)";
              el.style.color = "var(--text-primary)";
            } else if (variant === "danger") {
              el.style.background = "rgba(255, 71, 87, 0.18)";
              el.style.borderColor = "rgba(255,71,87,0.50)";
              el.style.boxShadow = "0 0 20px rgba(255,71,87,0.15)";
              el.style.transform = "translateY(-1px)";
            }
          }
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.transform = "";
          el.style.boxShadow = "";
          if (variant === "primary") {
            el.style.boxShadow = "0 2px 12px rgba(108,59,255,0.50), 0 0 20px rgba(0,217,255,0.10)";
          } else if (variant === "secondary") {
            el.style.background = "rgba(108, 59, 255, 0.08)";
            el.style.borderColor = "var(--border-default)";
            el.style.color = "var(--violet-300)";
          } else if (variant === "ghost") {
            el.style.background = "transparent";
            el.style.color = "var(--text-secondary)";
          } else if (variant === "danger") {
            el.style.background = "rgba(255, 71, 87, 0.10)";
            el.style.borderColor = "rgba(255, 71, 87, 0.28)";
          }
        }}
        onMouseDown={(e) => {
          if (!props.disabled) e.currentTarget.style.transform = "translateY(0) scale(1)";
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
