"use client";

import { FC, ReactNode } from "react";
import { CircularProgress } from "@mui/material";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const ButtonTest: FC<ButtonProps> = ({
  children,
  onClick,
  loading = false,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-6 py-3 rounded-lg font-semibold text-white 
                  transition-all duration-300 ease-in-out 
                  ${
                    disabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 active:bg-green-700"
                  } 
                  ${className}`}
    >
      {loading ? (
        <CircularProgress size={24} style={{ color: "white" }} />
      ) : (
        children
      )}
    </button>
  );
};

export default ButtonTest;
