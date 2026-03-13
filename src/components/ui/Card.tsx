import { forwardRef, type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glow" | "sunken" | "elevated";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className = "", style, children, ...props }, ref) => {

    const variantStyles: React.CSSProperties =
      variant === "glow"
        ? {
            background:
              "linear-gradient(145deg, rgba(108,59,255,0.07) 0%, rgba(0,217,255,0.02) 50%, var(--surface-overlay) 100%)",
            border: "1px solid var(--border-default)",
            boxShadow:
              "var(--shadow-card), 0 0 40px rgba(108,59,255,0.06), 0 0 60px rgba(0,217,255,0.02)",
          }
        : variant === "sunken"
        ? {
            background: "var(--surface-sunken)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.25)",
          }
        : variant === "elevated"
        ? {
            background: "var(--surface-elevated)",
            border: "1px solid var(--border-default)",
            boxShadow: "var(--shadow-raised)",
          }
        : {
            /* default */
            background: "var(--surface-overlay)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          };

    return (
      <div
        ref={ref}
        className={`rounded-xl p-6 ${className}`}
        style={{
          borderRadius: "var(--radius-xl)",
          transition: "border-color var(--transition-base), box-shadow var(--transition-base), transform var(--transition-base)",
          ...variantStyles,
          ...style,
        }}
        onMouseEnter={(e) => {
          if (!props.onMouseEnter) {
            const el = e.currentTarget;
            el.style.borderColor = "rgba(108,59,255,0.35)";
            el.style.boxShadow = "var(--shadow-raised), 0 0 30px rgba(108,59,255,0.06)";
            el.style.transform = "translateY(-2px)";
          }
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          if (!props.onMouseLeave) {
            const el = e.currentTarget;
            el.style.borderColor = "";
            el.style.boxShadow = "";
            el.style.transform = "";
          }
          props.onMouseLeave?.(e);
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
