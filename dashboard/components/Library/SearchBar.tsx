import React from 'react';

interface SearchBarProps {
    query: string;
    onQueryChange: (query: string) => void;
    filters: { genre: string; language: string };
    onFilterChange: (filters: { genre?: string; language?: string }) => void;
    onReset: () => void;
    totalResults: number;
}

const GENRES = ['All', 'Classic', 'Modern Prose', 'Sci-Fi', 'Fantasy', 'Mystery', 'Romance'];
const LANGUAGES = ['All', 'Russian', 'English'];

const SearchBar: React.FC<SearchBarProps> = ({
    query,
    onQueryChange,
    filters,
    onFilterChange,
    onReset,
    totalResults
}) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative w-full lg:max-w-[600px]">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7E6A]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="Search books by title, author, genre..."
                        className="w-full h-[52px] pl-12 pr-12 bg-white border border-[#E5DCC8] rounded-[12px] text-base placeholder-[#8B7E6A] text-[#2C2416] focus:outline-none focus:border-[#3D2817] transition-colors font-sans"
                    />
                    {query && (
                        <button
                            onClick={() => onQueryChange('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B7E6A] hover:text-[#3D2817]"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="flex gap-4 w-full lg:w-auto font-sans">
                    <select
                        value={filters.genre}
                        onChange={(e) => onFilterChange({ genre: e.target.value })}
                        className="flex-1 lg:w-40 h-[52px] px-4 bg-white border border-[#E5DCC8] rounded-[12px] text-[#2C2416] focus:outline-none focus:border-[#3D2817] appearance-none"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%238B7E6A\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                    >
                        {GENRES.map(g => <option key={g} value={g}>{g === 'All' ? 'All Genres' : g}</option>)}
                    </select>

                    <select
                        value={filters.language}
                        onChange={(e) => onFilterChange({ language: e.target.value })}
                        className="flex-1 lg:w-40 h-[52px] px-4 bg-white border border-[#E5DCC8] rounded-[12px] text-[#2C2416] focus:outline-none focus:border-[#3D2817] appearance-none"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%238B7E6A\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                    >
                        {LANGUAGES.map(l => <option key={l} value={l}>{l === 'All' ? 'All Languages' : l}</option>)}
                    </select>

                    <button
                        onClick={onReset}
                        className="h-[52px] px-6 text-[#3D2817] font-medium hover:bg-[#E5DCC8] rounded-[12px] transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-sans">
                <span className="text-[#8B7E6A] text-sm mr-2">Popular:</span>
                {GENRES.filter(g => g !== 'All').map(genre => (
                    <button
                        key={genre}
                        onClick={() => onFilterChange({ genre })}
                        className={`px-4 py-1.5 rounded-full text-sm transition-all ${filters.genre === genre
                                ? 'bg-[#3D2817] text-white'
                                : 'bg-white border border-[#E5DCC8] text-[#8B7E6A] hover:border-[#3D2817] hover:text-[#3D2817]'
                            }`}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            <div className="text-[#8B7E6A] text-sm font-sans">
                Found: <span className="text-[#2C2416] font-semibold">{totalResults} {totalResults === 1 ? 'book' : 'books'}</span>
            </div>
        </div>
    );
};

export default SearchBar;
