export type RouteItem = {
    name: string;
    path: string;
    subItems?: RouteItem[];
}

export const ROUTES: RouteItem[] = [
    { name: "Inicio", path: "/" },
    { 
        name: "Tienda", 
        path: "/tienda",
        subItems: [
            { name: "Bicicletas", path: "/tienda/bicicletas" },
            { name: "Componentes", path: "/tienda/componentes" },
            { name: "Accesorios", path: "/tienda/accesorios" },
            { name: "Indumentaria", path: "/tienda/indumentaria" },
        ]
    },
    { name: "Contacto", path: "/contacto" },
    { name: "Ubicación", path: "/ubicacion" },
]