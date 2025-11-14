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
            { name: "Bicicletas", path: "/tienda?category=bicicletas" },
            { name: "Componentes", path: "/tienda?category=componentes" },
            { name: "Accesorios", path: "/tienda?category=accesorios" },
            { name: "Indumentaria", path: "/tienda?category=indumentaria" },
        ]
    },
    { name: "Bicicletas", path: "/tienda?category=bicicletas" },
    { name: "Componentes", path: "/tienda?category=componentes" },
    { name: "Accesorios", path: "/tienda?category=accesorios" },
    { name: "Indumentaria", path: "/tienda?category=indumentaria" },
    { name: "Contacto", path: "/contacto" },
]