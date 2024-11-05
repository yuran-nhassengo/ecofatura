import { deleteFactura, updateFactura } from "@/app/services/factura";
import { NextResponse } from "next/server";

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