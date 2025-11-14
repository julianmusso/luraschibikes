'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
    images: Array<{
        asset: { url: string };
        alt?: string;
    }>;
    productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const fallbackImage = '/assets/images/product-placeholder.png';
    const currentImage = images?.[selectedIndex]?.asset.url || fallbackImage;
    const currentAlt = images?.[selectedIndex]?.alt || productName;

    if (!images || images.length === 0) {
        return (
            <div className="border border-sky-500 bg-slate-900/80 rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                    <Image
                        src={fallbackImage}
                        alt={productName}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Imagen principal */}
            <div className="border border-sky-500 bg-slate-900/80 rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                    <Image
                        src={currentImage}
                        alt={currentAlt}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative aspect-square border-2 rounded-lg overflow-hidden transition-all ${selectedIndex === index
                                    ? 'border-blue-400 ring-2 ring-blue-400/50'
                                    : 'border-slate-700 hover:border-slate-500'
                                }`}
                        >
                            <Image
                                src={image.asset.url}
                                alt={image.alt || `${productName} ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
