/**
 * Componente de Título de Página
 * 
 * En realidad tenemos 5 páginas, no sé qué tan necesario sea esto, pero quise hacer
 * una prueba de componente reutilizable para los títulos.
 * 
 * @param title Título principal de la página
 * @param subtitle Subtítulo opcional
 * @param badge Texto del badge opcional
 * @param badgeIcon Icono del badge opcional
 * @returns Componente de título de página con estilo consistente
 */
export function PageTitle({
    title,
    subtitle,
    badge,
    badgeIcon,
}: {
    title: string;
    subtitle?: string;
    badge?: string;
    badgeIcon?: React.ReactNode | string;
}) {
    return (
        <>
            {badge && (
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 bg-blue-600/30 text-blue-200 rounded-full text-sm font-medium">
                    {badgeIcon && <span className="w-4 h-4">{badgeIcon}</span>}
                    <span>{badge}</span>
                </div>
            )}
            <div className="text-white space-y-3">
                <h1 className="text-5xl font-bold">{title}</h1>
                {subtitle && <p className="text-base lg:text-lg lg:max-w-1/2 text-neutral-200">{subtitle}</p>}
            </div>

        </>
    )
}