'use client';

import { useState } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

type UserProfile = {
    name: string;
    email: string;
    phone?: string | null;
    dni?: string | null;
    address?: string | null;
    number?: string | null;
    floor?: string | null;
    apartment?: string | null;
    city?: string | null;
    province?: string | null;
    zipCode?: string | null;
};

type ProfileEditorProps = {
    initialData: UserProfile;
};

export default function ProfileEditor({ initialData }: ProfileEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState<UserProfile>(initialData);

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al guardar el perfil');
            }

            setSuccess(true);
            setIsEditing(false);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialData);
        setIsEditing(false);
        setError(null);
    };

    return (
        <div>
            {/* Header con botón de editar */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Datos de Contacto y Envío</h3>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <FaEdit />
                        Editar
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:bg-green-700 text-white px-3 py-1 rounded transition-colors"
                        >
                            <FaSave />
                            {isSaving ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="cursor-pointer flex items-center gap-2 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 text-white px-3 py-1 rounded transition-colors"
                        >
                            <FaTimes />
                            Cancelar
                        </button>
                    </div>
                )}
            </div>

            {/* Mensajes */}
            {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-green-900/20 border border-green-500/50 rounded text-green-400 text-sm">
                    ✓ Perfil actualizado correctamente
                </div>
            )}

            {/* Formulario */}
            <div className="space-y-4">
                {/* Nombre y Email (read-only) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Nombre completo</label>
                        <input
                            type="text"
                            value={formData.name}
                            disabled
                            className="w-full bg-slate-700 text-slate-400 px-3 py-2 rounded cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full bg-slate-700 text-slate-400 px-3 py-2 rounded cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Teléfono y DNI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Teléfono</label>
                        <input
                            type="tel"
                            value={formData.phone || ''}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            disabled={!isEditing}
                            className="w-full bg-slate-800 border border-slate-600 disabled:bg-slate-700 disabled:text-slate-400 px-3 py-2 rounded focus:outline-none focus:border-blue-400"
                            placeholder="Ej: 11 1234-5678"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">DNI</label>
                        <input
                            type="text"
                            value={formData.dni || ''}
                            onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                            disabled={!isEditing}
                            className="w-full bg-slate-800 border border-slate-600 disabled:bg-slate-700 disabled:text-slate-400 px-3 py-2 rounded focus:outline-none focus:border-blue-400"
                            placeholder="Ej: 12345678"
                        />
                    </div>
                </div>

                {/* Dirección */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-slate-400 text-sm mb-1">Calle</label>
                        <input
                            type="text"
                            value={formData.address || ''}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            disabled={!isEditing}
                            className="w-full bg-slate-800 border border-slate-600 disabled:bg-slate-700 disabled:text-slate-400 px-3 py-2 rounded focus:outline-none focus:border-blue-400"
                            placeholder="Ej: Av. Corrientes"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Número</label>
                        <input
                            type="text"
                            value={formData.number || ''}
                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                            disabled={!isEditing}
                            className="w-full bg-slate-800 border border-slate-600 disabled:bg-slate-700 disabled:text-slate-400 px-3 py-2 rounded focus:outline-none focus:border-blue-400"
                            placeholder="1234"
                        />
                    </div>
                </div>

                {/* Piso y Departamento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Piso (opcional)</label>
                        <input
                            type="text"
                            value={formData.floor || ''}
                            onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                            disabled={!isEditing}
                            className="w-full bg-slate-800 border border-slate-600 disabled:bg-slate-700 disabled:text-slate-400 px-3 py-2 rounded focus:outline-none focus:border-blue-400"
                            placeholder="Ej: 5"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Departamento (opcional)</label>
                        <input
                            type="text"
                            value={formData.apartment || ''}
                            onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                            disabled={!isEditing}
                            className="w-full bg-slate-800 border border-slate-600 disabled:bg-slate-700 disabled:text-slate-400 px-3 py-2 rounded focus:outline-none focus:border-blue-400"
                            placeholder="Ej: B"
                        />
                    </div>
                </div>

                {/* Ciudad, Provincia, CP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Ciudad</label>
                        <input
                            type="text"
                            value={formData.city || ''}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            disabled={!isEditing}
                            className="w-full bg-slate-800 border border-slate-600 disabled:bg-slate-700 disabled:text-slate-400 px-3 py-2 rounded focus:outline-none focus:border-blue-400"
                            placeholder="Ej: CABA"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Provincia</label>
                        <input
                            type="text"
                            value={formData.province || ''}
                            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                            disabled={!isEditing}
                            className="w-full bg-slate-800 border border-slate-600 disabled:bg-slate-700 disabled:text-slate-400 px-3 py-2 rounded focus:outline-none focus:border-blue-400"
                            placeholder="Ej: Buenos Aires"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Código Postal</label>
                        <input
                            type="text"
                            value={formData.zipCode || ''}
                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                            disabled={!isEditing}
                            className="w-full bg-slate-800 border border-slate-600 disabled:bg-slate-700 disabled:text-slate-400 px-3 py-2 rounded focus:outline-none focus:border-blue-400"
                            placeholder="Ej: 1004"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
