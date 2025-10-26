import React, { useState, useRef, useEffect } from "react";

export interface Option {
  value: string;
  label: string;
}

export interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  labelPosition?: "top" | "left";
  className?: string;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder,
  label,
  labelPosition = "top",
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      className={`inline-flex ${
        labelPosition === "left" ? "items-center gap-1" : "flex-col"
      } ${className}`}
    >
      {label && (
        <label
          className={`text-xs text-gray-500 whitespace-nowrap ${
            labelPosition === "left" ? "" : "mb-0.5"
          }`}
        >
          {label}
        </label>
      )}
      <div ref={selectRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
          bg-transparent text-gray-400 hover:text-white 
          px-2 py-1 text-xs cursor-pointer
          focus:outline-none
          transition-colors duration-150
          flex items-center justify-between gap-1
        `}
        >
          <span className={selectedOption ? "text-white" : "text-gray-400"}>
            {selectedOption ? selectedOption.label : placeholder || "Select..."}
          </span>
          <svg
            className={`w-3 h-3 transition-transform duration-150 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg overflow-hidden py-1 min-w-full">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                w-full text-left px-3 py-1.5 text-xs cursor-pointer
                transition-colors duration-150
                ${
                  option.value === value
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }
              `}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
