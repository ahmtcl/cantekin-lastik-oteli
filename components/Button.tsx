import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  fullWidth = false,
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyles =
    "px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Yükleniyor..." : children}
    </button>
  );
};
