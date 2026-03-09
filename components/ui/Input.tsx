"use client";
import { InputHTMLAttributes, forwardRef, ReactNode, useState } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  label?: string;
  hint?: string;
  error?: string;
  badge?: { text: string; color?: "blue" | "green" | "red" };
  rightElement?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, label, hint, error, badge, rightElement, className, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor={id}
              className="text-[11.5px] font-bold text-mid uppercase tracking-[.04em]"
            >
              {label}
            </label>
            {badge && (
              <span
                className={clsx(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                  badge.color === "green" && "bg-green-pale text-green",
                  badge.color === "red"   && "bg-red-50 text-red-600",
                  (!badge.color || badge.color === "blue") && "bg-blue-pale text-blue"
                )}
              >
                {badge.text}
              </span>
            )}
          </div>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none flex transition-colors">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={clsx(
              "input-base",
              icon ? "pl-10" : "pl-3.5",
              rightElement && "pr-10",
              error && "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,.09)]",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-[11.5px] text-red-500">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-[11.5px] text-muted">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;
