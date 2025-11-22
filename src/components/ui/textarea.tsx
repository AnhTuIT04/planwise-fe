import React from "react";

interface TextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

export const Textarea = ({
  value,
  onChange,
  placeholder = "",
  className = "",
  name,
  autoFocus,
  disabled,
}: TextareaProps) => {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoFocus={autoFocus}
      disabled={disabled}
      className={`w-full resize-none rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${className}`}
    />
  );
};
