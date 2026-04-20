"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={`input-group ${error ? "input-group--error" : ""}`}>
      {label && (
        <label htmlFor={inputId} className="input-group__label">
          {label}
        </label>
      )}
      <div className="input-group__wrapper">
        {icon && <span className="input-group__icon">{icon}</span>}
        <input
          id={inputId}
          className={`input-group__input ${icon ? "input-group__input--with-icon" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
}
