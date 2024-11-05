import { deleteFactura, getFacturaById, updateFactura } from "@/app/services/factura";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const body = await request.json();
    try {
        const updatedFactura = await updateFactura(params.id, body); 
        return NextResponse.json(updatedFactura);
    } catch (error) {
        return NextResponse.json({ error: `Failed to update invoice: ${error}` }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const deletedFactura = await deleteFactura(params.id);
        return NextResponse.json(deletedFactura);
    } catch (error) {
        return NextResponse.json({ error: `Error deleting the item: ${error}` }, { status: 500 });
    }
}


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const factura = await getFacturaById(params.id); 

        if (!factura) {
            return NextResponse.json({ error: `Factura not found` }, { status: 404 });
        }

        return NextResponse.json(factura);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: `Error: ${error}` }, { status: 500 });
    }
}
