import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/getSession';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            );
        }

        const data = await request.json();

        // Actualizar usuario en Prisma
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: data.name,
                phone: data.phone || null,
                dni: data.dni || null,
                address: data.address || null,
                number: data.number || null,
                floor: data.floor || null,
                apartment: data.apartment || null,
                city: data.city || null,
                province: data.province || null,
                zipCode: data.zipCode || null,
            }
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Error al actualizar el perfil' },
            { status: 500 }
        );
    }
}
