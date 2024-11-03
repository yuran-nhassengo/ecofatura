import { createFactura, deleteFactura, getAllFacturas, updateFactura } from "@/app/services/factura";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    try {
        const facturas = await getAllFacturas();
        return NextResponse.json(facturas);
    } catch (error) {
        return NextResponse.json({ error: 'Erro' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const { codigo, nome, tipo, data, entidade, valor, descricao, nuit } = body;
        const newFactura = await createFactura(codigo, nome, tipo, data, entidade, valor, descricao, nuit);
        return NextResponse.json(newFactura, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'erro' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const body = await request.json();
    try {
        const updatedFactura = await updateFactura((params.id), body);
        return NextResponse.json(updatedFactura);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const deletedFactura = await deleteFactura((params.id));
        return NextResponse.json(deletedFactura);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
    }
}