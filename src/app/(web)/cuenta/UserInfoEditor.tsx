'use client';

import { useState } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

type UserData = {
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

type UserInfoEditorProps = {
    initialData: UserData;
};

export default function UserInfoEditor({ initialData }: UserInfoEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<UserData>(initialData);

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        try {
            const response = await fetch('/api/user/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al guardar');
            }

            setIsEditing(false);
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

    if (!isEditing) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Información de Contacto</h3>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                        <FaEdit /> Editar
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-slate-400 text-xs">Nombre</p>
                        <p className="font-medium">{formData.name}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs">Email</p>
                        <p className="font-medium">{formData.email}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs">Teléfono</p>
                        <p className="font-medium">{formData.phone || '-'}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs">DNI</p>
                        <p className="font-medium">{formData.dni || '-'}</p>
                    </div>
                </div>

                {(formData.address || formData.city) && (
                    <>
                        <div className="border-t border-slate-700 pt-4 mt-4">
                            <h4 className="font-semibold mb-3">Dirección</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <p className="text-slate-400 text-xs">Calle</p>
                                    <p className="font-medium">{formData.address || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs">Número</p>
                                    <p className="font-medium">{formData.number || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs">Piso</p>
                                    <p className="font-medium">{formData.floor || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs">Departamento</p>
                                    <p className="font-medium">{formData.apartment || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs">Ciudad</p>
                                    <p className="font-medium">{formData.city || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs">Provincia</p>
                                    <p className="font-medium">{formData.province || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs">Código Postal</p>
                                    <p className="font-medium">{formData.zipCode || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Editar Información</h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="cursor-pointer flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm px-3 py-1 rounded"
                    >
                        <FaTimes /> Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-700 text-white transition-colors text-sm px-4 py-1 rounded"
                    >
                        <FaSave /> {isSaving ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-slate-400 text-xs mb-1">Nombre *</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-slate-400 text-xs mb-1">Email</label>
                    <input
                        type="email"
                        disabled
                        value={formData.email}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-500 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-slate-400 text-xs mb-1">Teléfono</label>
                    <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-slate-400 text-xs mb-1">DNI</label>
                    <input
                        type="text"
                        value={formData.dni || ''}
                        onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                    />
                </div>
            </div>

            <div className="border-t border-slate-700 pt-4 mt-4">
                <h4 className="font-semibold mb-3">Dirección</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-slate-400 text-xs mb-1">Calle</label>
                        <input
                            type="text"
                            value={formData.address || ''}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-xs mb-1">Número</label>
                        <input
                            type="text"
                            value={formData.number || ''}
                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-xs mb-1">Piso</label>
                        <input
                            type="text"
                            value={formData.floor || ''}
                            onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-xs mb-1">Departamento</label>
                        <input
                            type="text"
                            value={formData.apartment || ''}
                            onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-xs mb-1">Ciudad</label>
                        <input
                            type="text"
                            value={formData.city || ''}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-xs mb-1">Provincia</label>
                        <input
                            type="text"
                            value={formData.province || ''}
                            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-xs mb-1">Código Postal</label>
                        <input
                            type="text"
                            value={formData.zipCode || ''}
                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
