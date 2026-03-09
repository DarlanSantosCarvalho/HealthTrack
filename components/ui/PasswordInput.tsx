"use client";
import { InputHTMLAttributes, forwardRef, useState } from "react";
import Input from "./Input";
import clsx from "clsx";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  hint?: string;
  error?: string;
  showStrength?: boolean;
  id?: string;
}

function getStrength(pw: string) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const strengthConfig = [
  { label: "Muito fraca", color: "bg-red-400" },
  { label: "Fraca",       color: "bg-red-400" },
  { label: "Média",       color: "bg-amber-400" },
  { label: "Forte",       color: "bg-green" },
];

const EyeOpen = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeClosed = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, hint, error, showStrength, onChange, value, id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const [localVal, setLocalVal] = useState("");

    const currentVal = (value as string) ?? localVal;
    const strength = getStrength(currentVal);
    const cfg = strengthConfig[Math.max(0, strength - 1)];

    return (
      <div className="w-full">
        <Input
          ref={ref}
          id={id}
          type={visible ? "text" : "password"}
          label={label}
          hint={hint}
          error={error}
          icon={<LockIcon />}
          value={value}
          onChange={(e) => {
            setLocalVal(e.target.value);
            onChange?.(e);
          }}
          rightElement={
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="text-muted hover:text-blue transition-colors p-1 rounded"
              tabIndex={-1}
            >
              {visible ? <EyeClosed /> : <EyeOpen />}
            </button>
          }
          {...props}
        />
        {showStrength && currentVal && (
          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={clsx(
                  "flex-1 h-[3px] rounded-full transition-all duration-300",
                  i <= strength ? cfg.color : "bg-border"
                )}
              />
            ))}
            <span className={clsx("text-[11px] font-semibold ml-1 min-w-[56px]",
              strength <= 2 ? "text-red-400" : strength === 3 ? "text-amber-500" : "text-green"
            )}>
              {cfg?.label}
            </span>
          </div>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
