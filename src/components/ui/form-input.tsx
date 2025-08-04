import React from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  id: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "tel"
    | "url";
  error?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export default function FormInput({
  label,
  id,
  type = "text",
  error,
  required = false,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  className = "",
  disabled,
  ...props
}: FormInputProps) {
  const inputType =
    showPasswordToggle && type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          id={id}
          type={inputType}
          disabled={disabled}
          className={`
             block w-full px-3 py-2 border rounded-md shadow-sm 
             focus:outline-none
             disabled:opacity-50 disabled:cursor-not-allowed
             ${showPasswordToggle ? "pr-10" : ""}
             ${
               error
                 ? "border-red-300  focus:border-red-500"
                 : "border-gray-300  focus:border-indigo-500"
             }
             ${className}
           `}
          {...props}
        />

        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
