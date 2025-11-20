import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/getSession';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                dni: true,
                address: true,
                number: true,
                floor: true,
                apartment: true,
                city: true,
                province: true,
                zipCode: true,
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { error: 'Error al obtener el perfil' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            );
        }

        const data = await request.json();

        // Actualizar solo los campos permitidos
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                phone: data.phone || null,
                dni: data.dni || null,
                address: data.address || null,
                number: data.number || null,
                floor: data.floor || null,
                apartment: data.apartment || null,
                city: data.city || null,
                province: data.province || null,
                zipCode: data.zipCode || null,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                dni: true,
                address: true,
                number: true,
                floor: true,
                apartment: true,
                city: true,
                province: true,
                zipCode: true,
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        return NextResponse.json(
            { error: 'Error al actualizar perfil' },
            { status: 500 }
        );
    }
}
