'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { FilterAttribute } from '@/core/server.getFilterableAttributes';
import type { Category } from '@/types/sanity';
import { FaSearch, FaTimes } from 'react-icons/fa';
import * as Icons from 'react-icons/fa';

interface ProductFiltersProps {
    filterAttributes: FilterAttribute[];
    categories: Category[];
    brands: string[];
}

export function ProductFilters({ filterAttributes, categories, brands }: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Estado local para inputs
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    const updateURL = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        // Aplicar cambios
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        // Resetear página al cambiar filtros
        if (!updates.page) {
            params.delete('page');
        }

        // Navegar con transición
        startTransition(() => {
            router.push(`/tienda?${params.toString()}`, { scroll: false });
        });
    };

    const handleSearch = () => {
        updateURL({ search: searchInput || null });
    };

    const handlePriceChange = () => {
        updateURL({
            minPrice: minPrice || null,
            maxPrice: maxPrice || null,
        });
    };

    const handleCategoryChange = (categorySlug: string) => {
        const current = searchParams.get('category');
        updateURL({ category: current === categorySlug ? null : categorySlug });
    };

    const handleBrandChange = (brand: string) => {
        const current = searchParams.get('brand');
        updateURL({ brand: current === brand ? null : brand });
    };

    const handleAttributeChange = (attrSlug: string, valueSlug: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentValues = params.get(attrSlug)?.split(',') || [];

        let newValues: string[];
        if (currentValues.includes(valueSlug)) {
            // Remover
            newValues = currentValues.filter(v => v !== valueSlug);
        } else {
            // Agregar
            newValues = [...currentValues, valueSlug];
        }

        updateURL({
            [attrSlug]: newValues.length > 0 ? newValues.join(',') : null,
        });
    };

    const handleSortChange = (sort: string) => {
        updateURL({ sort });
    };

    const clearAllFilters = () => {
        setSearchInput('');
        setMinPrice('');
        setMaxPrice('');
        router.push('/tienda');
    };

    const getIconComponent = (iconName?: string) => {
        if (!iconName) return null;
        const Icon = Icons[iconName as keyof typeof Icons];
        return Icon ? <Icon className="text-blue-400" /> : null;
    };

    const hasActiveFilters = searchParams.toString().length > 0;

    return (
        <aside className="space-y-6">
            {/* Búsqueda */}
            <div className="border border-sky-500 bg-slate-900/80 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <FaSearch className="text-blue-400" />
                    Búsqueda
                </h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="flex-1 bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded transition-colors"
                    >
                        <FaSearch />
                    </button>
                </div>
            </div>

            {/* Ordenamiento */}
            <div className="border border-sky-500 bg-slate-900/80 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Ordenar por</h3>
                <select
                    value={searchParams.get('sort') || 'newest'}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                >
                    <option value="newest">Más recientes</option>
                    <option value="oldest">Más antiguos</option>
                    <option value="price-asc">Precio: menor a mayor</option>
                    <option value="price-desc">Precio: mayor a menor</option>
                    <option value="name-asc">Nombre: A-Z</option>
                    <option value="name-desc">Nombre: Z-A</option>
                </select>
            </div>

            {/* Categorías */}
            {categories.length > 0 && (
                <div className="border border-sky-500 bg-slate-900/80 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">Categorías</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {categories.map((category) => {
                            const isSelected = searchParams.get('category') === category.slug.current;
                            return (
                                <button
                                    key={category._id}
                                    onClick={() => handleCategoryChange(category.slug.current)}
                                    className={`w-full text-left px-3 py-2 rounded transition-colors ${isSelected
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Marcas */}
            {brands.length > 0 && (
                <div className="border border-sky-500 bg-slate-900/80 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">Marcas</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {brands.map((brand) => {
                            const isSelected = searchParams.get('brand') === brand;
                            return (
                                <button
                                    key={brand}
                                    onClick={() => handleBrandChange(brand)}
                                    className={`w-full text-left px-3 py-2 rounded transition-colors ${isSelected
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        }`}
                                >
                                    {brand}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Precio */}
            <div className="border border-sky-500 bg-slate-900/80 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Rango de precio</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-sm text-slate-400 block mb-1">Mínimo</label>
                        <input
                            type="number"
                            placeholder="$ 0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            onBlur={handlePriceChange}
                            className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-slate-400 block mb-1">Máximo</label>
                        <input
                            type="number"
                            placeholder="$ Sin límite"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            onBlur={handlePriceChange}
                            className="w-full bg-slate-800 text-white border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                        />
                    </div>
                </div>
            </div>

            {/* Atributos filtrables dinámicos */}
            {filterAttributes.map((attr) => {
                const selectedValues = searchParams.get(attr.slug.current)?.split(',') || [];

                return (
                    <div key={attr._id} className="border border-sky-500 bg-slate-900/80 rounded-lg p-4">
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            {getIconComponent(attr.icon)}
                            {attr.name}
                        </h3>
                        <div className="space-y-2">
                            {attr.values.map((value) => {
                                const isSelected = selectedValues.includes(value.slug.current);

                                return (
                                    <label
                                        key={value.slug.current}
                                        className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleAttributeChange(attr.slug.current, value.slug.current)}
                                            className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500"
                                        />
                                        <span>{value.label}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {/* Botón limpiar filtros */}
            {hasActiveFilters && (
                <button
                    onClick={clearAllFilters}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <FaTimes />
                    Limpiar todos los filtros
                </button>
            )}

            {/* Indicador de carga */}
            {isPending && (
                <div className="text-center text-slate-400 text-sm">
                    Actualizando resultados...
                </div>
            )}
        </aside>
    );
}