import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  value?: string;
  defaultValue?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  value,
  defaultValue = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    options.find((opt) => opt.value === defaultValue) || null
  );

  // Update selected option when value prop changes
  useEffect(() => {
    const option = options.find((opt) => opt.value === value);
    setSelectedOption(option || null);
  }, [value, options]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    setSearchTerm("");
    setIsOpen(false);
    onChange(option.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleInputClick = () => {
    setIsOpen(true);
    if (selectedOption) {
      setSearchTerm(""); // Clear search when opening to show all options
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`}
          placeholder={placeholder}
          value={isOpen ? searchTerm : selectedOption?.label || ""}
          onChange={handleInputChange}
          onClick={handleInputClick}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg dark:bg-gray-900 dark:border-gray-700 max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2 cursor-pointer text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedOption?.value === option.value
                    ? "bg-gray-50 dark:bg-gray-800"
                    : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
