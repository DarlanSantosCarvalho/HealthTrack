"use client";
import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gradient" | "outline" | "ghost" | "green" | "blue";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "gradient", size = "md", loading, className, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 relative overflow-hidden cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

    const sizes = {
      sm: "px-4 py-2.5 text-sm",
      md: "px-5 py-3.5 text-sm",
      lg: "px-6 py-4 text-[15px]",
    };

    const variants = {
      gradient: "btn-gradient text-white w-full",
      green: "bg-green text-white hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(73,132,103,.28)] hover:shadow-[0_8px_24px_rgba(73,132,103,.35)]",
      blue: "bg-blue text-white hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(28,110,140,.28)] hover:shadow-[0_8px_24px_rgba(28,110,140,.35)]",
      outline: "border-[1.5px] border-border bg-white text-dark hover:border-muted hover:bg-surface hover:-translate-y-0.5",
      ghost: "text-mid hover:bg-surface hover:text-blue",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(base, sizes[size], variants[variant], className)}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Aguarde...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
