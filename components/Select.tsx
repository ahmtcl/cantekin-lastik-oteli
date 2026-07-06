import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: string[];
}

export default function Select({
  label,
  error,
  options,
  required,
  disabled,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        {...props}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
        } focus:ring-4 focus:outline-none transition-all bg-white text-gray-900 ${
          disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""
        }`}
      >
        <option value="">Seçiniz...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
