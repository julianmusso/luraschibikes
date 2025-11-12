'use client'

import { useState } from "react"

export function BuyNowButton({ productId }: { productId: string }) {
    const [loading, setLoading] = useState(false)

    const handleBuyNow = async () => {
        setLoading(true)
        // Lógica para manejar la compra
        setLoading(false)
    }

    return (
        <button
            className="bg-"
            onClick={handleBuyNow}
            disabled={loading}>
            {loading ? "Cargando..." : "Comprar ahora"}
        </button>
    )
}