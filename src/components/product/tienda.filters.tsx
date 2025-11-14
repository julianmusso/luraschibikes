'use client';

import { useState } from 'react';

interface ProductFiltersProps {
    onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    search?: string;
}

export function ProductFilters({ onFilterChange }: ProductFiltersProps) {
    const [filters, setFilters] = useState<FilterState>({});

    const handleFilterChange = (key: keyof FilterState, value: string | number | undefined) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    const clearFilters = () => {
        setFilters({});
        onFilterChange?.({});
    };

    return (
        <aside className="space-y-6">
            {/* Búsqueda */}
            <div className="border border-sky-500 bg-slate-900/80 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Búsqueda</h3>
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
                    className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                />
            </div>

            {/* Rango de precio */}
            <div className="border border-sky-500 bg-slate-900/80 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Precio</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-sm text-slate-400 block mb-1">Mínimo</label>
                        <input
                            type="number"
                            placeholder="$ 0"
                            value={filters.minPrice || ''}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                            className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-slate-400 block mb-1">Máximo</label>
                        <input
                            type="number"
                            placeholder="$ Sin límite"
                            value={filters.maxPrice || ''}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                            className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                        />
                    </div>
                </div>
            </div>

            {/* Marca */}
            <div className="border border-sky-500 bg-slate-900/80 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Marca</h3>
                <input
                    type="text"
                    placeholder="Filtrar por marca..."
                    value={filters.brand || ''}
                    onChange={(e) => handleFilterChange('brand', e.target.value || undefined)}
                    className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                />
            </div>

            {/* Botón limpiar filtros */}
            <button
                onClick={clearFilters}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
                Limpiar filtros
            </button>
        </aside>
    );
}
