import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[#0A1628]">{label}</label>
        )}
        <input
          ref={ref}
          className={`rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-[#0A1628] placeholder:text-[#475569]/50 focus:border-[#2E5C8A] focus:outline-none focus:ring-2 focus:ring-[#4A7DAC]/20 ${error ? "border-[#EF4444]" : ""} ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-[#EF4444]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
