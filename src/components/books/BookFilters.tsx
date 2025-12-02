'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

interface FiltersProps {
    onFilterChange: (filters: any) => void;
}

export function BookFilters({ onFilterChange }: FiltersProps) {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [selectedLanguage, setSelectedLanguage] = useState('all');

    const categories = [
        'Fiction',
        'Non-Fiction',
        'Folklore',
        'History',
        'Poetry',
        'Children',
        'Education',
    ];

    const languages = [
        { value: 'all', label: 'All Languages' },
        { value: 'kalenjin', label: 'Kalenjin' },
        { value: 'english', label: 'English' },
        { value: 'bilingual', label: 'Bilingual' },
    ];

    const handleCategoryToggle = (category: string) => {
        const updated = selectedCategories.includes(category)
            ? selectedCategories.filter((c) => c !== category)
            : [...selectedCategories, category];
        setSelectedCategories(updated);
        onFilterChange({ categories: updated, priceRange, language: selectedLanguage });
    };

    const handleClearFilters = () => {
        setSelectedCategories([]);
        setPriceRange([0, 2000]);
        setSelectedLanguage('all');
        onFilterChange({ categories: [], priceRange: [0, 2000], language: 'all' });
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-neutral-brown-900 flex items-center gap-2">
                    <SlidersHorizontal size={20} />
                    Filters
                </h3>
                <button
                    onClick={handleClearFilters}
                    className="text-sm text-primary hover:text-primary-dark font-medium"
                >
                    Clear All
                </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
                <h4 className="font-semibold text-neutral-brown-900 mb-3">Categories</h4>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <label key={category} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryToggle(category)}
                                className="w-4 h-4 text-primary border-neutral-brown-500/20 rounded focus:ring-primary"
                            />
                            <span className="text-sm text-neutral-brown-700">{category}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <h4 className="font-semibold text-neutral-brown-900 mb-3">Price Range</h4>
                <div className="space-y-3">
                    <input
                        type="range"
                        min="0"
                        max="2000"
                        value={priceRange[1]}
                        onChange={(e) => {
                            const newRange = [0, parseInt(e.target.value)];
                            setPriceRange(newRange);
                            onFilterChange({ categories: selectedCategories, priceRange: newRange, language: selectedLanguage });
                        }}
                        className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-neutral-brown-700">
                        <span>KES 0</span>
                        <span className="font-semibold text-primary">KES {priceRange[1]}</span>
                    </div>
                </div>
            </div>

            {/* Language */}
            <div>
                <h4 className="font-semibold text-neutral-brown-900 mb-3">Language</h4>
                <div className="space-y-2">
                    {languages.map((lang) => (
                        <label key={lang.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="language"
                                value={lang.value}
                                checked={selectedLanguage === lang.value}
                                onChange={(e) => {
                                    setSelectedLanguage(e.target.value);
                                    onFilterChange({ categories: selectedCategories, priceRange, language: e.target.value });
                                }}
                                className="w-4 h-4 text-primary border-neutral-brown-500/20 focus:ring-primary"
                            />
                            <span className="text-sm text-neutral-brown-700">{lang.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
