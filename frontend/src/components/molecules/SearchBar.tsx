import React from 'react';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Cari...',
  value,
  onChange,
  onSearch,
  className = '',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Pattern Islami - Blur 3xl */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-300 rounded-full blur-3xl opacity-10 mix-blend-soft-light pointer-events-none" />
      
      <div className="relative z-10 flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 text-sm bg-white/70 backdrop-blur-xl border border-white/60 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-inherit transition-all duration-300"
        />
        <span className="absolute left-4 text-gray-400 text-lg pointer-events-none">
          🔍
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
