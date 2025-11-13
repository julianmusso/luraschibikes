interface BackgroundGridProps {
    /** Color del gradiente de fondo (array de colores para stops) */
    gradientColors?: string[];
    /** Color de las líneas de la grilla (con opacidad) */
    gridColor?: string;
    /** Tamaño de cada celda de la grilla en px */
    gridSize?: number;
    /** Posición del spotlight (ej: '50% 25%' para centro-arriba) */
    spotlightPosition?: string;
    /** Tamaño del spotlight (ej: '35%' para el área iluminada) */
    spotlightSize?: string;
    /** Difuminado del spotlight (ej: '90%' donde termina) */
    spotlightBlur?: string;
    /** Desactivar el efecto de grilla */
    disableGrid?: boolean;
    /** Desactivar el efecto de spotlight */
    disableSpotlight?: boolean;
}

export function BackgroundGrid({
    gradientColors = ['rgb(10, 27, 46)', 'rgb(11, 34, 58)', 'rgb(11, 42, 73)', 'rgb(7, 26, 48)'],
    gridColor = 'rgba(148, 163, 184, 0.1)',
    gridSize = 28,
    spotlightPosition = '50% 25%',
    spotlightSize = '35%',
    spotlightBlur = '90%',
    disableGrid = false,
    disableSpotlight = false,
}: BackgroundGridProps) {
    // Construir gradiente de fondo
    const backgroundGradient = gradientColors.length === 1 
        ? gradientColors[0]
        : `linear-gradient(${gradientColors[0]} 0%, ${gradientColors[1]} 33%, ${gradientColors[2] || gradientColors[1]} 66%, ${gradientColors[3] || gradientColors[0]} 100%)`;

    // Construir grilla
    const gridBackground = disableGrid 
        ? undefined
        : `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(${gridColor} 1px, transparent 1px)`;

    // Construir máscara de spotlight
    const spotlightMask = disableSpotlight 
        ? undefined
        : `radial-gradient(circle at ${spotlightPosition}, black ${spotlightSize}, transparent ${spotlightBlur})`;

    return (
        <>
            {/* Capa de fondo con gradiente */}
            <div 
                className="fixed inset-0 -z-30" 
                aria-hidden="true"
                style={{ backgroundImage: backgroundGradient }}
            />
            
            {/* Capa de grilla con spotlight */}
            {!disableGrid && (
                <div 
                    className="fixed inset-0 -z-20 pointer-events-none" 
                    aria-hidden="true"
                    style={{
                        backgroundImage: gridBackground,
                        backgroundSize: `${gridSize}px ${gridSize}px`,
                        maskImage: spotlightMask,
                        WebkitMaskImage: spotlightMask, // Compatibilidad Safari
                    }}
                />
            )}
        </>
    );
}
