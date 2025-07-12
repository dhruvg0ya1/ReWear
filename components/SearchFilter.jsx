import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Button from './Button';

const SearchFilter = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'outerwear', label: 'Outerwear' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'shoes', label: 'Shoes' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'points-low', label: 'Points: Low to High' },
    { value: 'points-high', label: 'Points: High to Low' }
  ];

  const handleSearch = () => {
    onSearch(searchTerm, category, sortBy);
  };

  const handleReset = () => {
    setSearchTerm('');
    setCategory('all');
    setSortBy('newest');
    onSearch('', 'all', 'newest');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#354F52]" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for items..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#52796F] focus:border-transparent"
          />
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSearch} className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Button>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-[#354F52] mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#52796F] focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-[#354F52] mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#52796F] focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-end space-x-2">
              <Button
                onClick={handleSearch}
                className="flex-1 flex items-center justify-center space-x-1"
              >
                <Search className="w-4 h-4" />
                <span>Apply</span>
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(searchTerm || category !== 'all' || sortBy !== 'newest') && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm font-medium text-[#354F52]">Active filters:</span>
          
          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#CAD2C5] text-[#354F52]">
              Search: "{searchTerm}"
              <button
                onClick={() => {
                  setSearchTerm('');
                  onSearch('', category, sortBy);
                }}
                className="ml-1 hover:text-[#52796F]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {category !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#CAD2C5] text-[#354F52]">
              Category: {categories.find(c => c.value === category)?.label}
              <button
                onClick={() => {
                  setCategory('all');
                  onSearch(searchTerm, 'all', sortBy);
                }}
                className="ml-1 hover:text-[#52796F]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {sortBy !== 'newest' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#CAD2C5] text-[#354F52]">
              Sort: {sortOptions.find(s => s.value === sortBy)?.label}
              <button
                onClick={() => {
                  setSortBy('newest');
                  onSearch(searchTerm, category, 'newest');
                }}
                className="ml-1 hover:text-[#52796F]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          <Button
            onClick={handleReset}
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;