import { deleteFactura, getFacturaById, updateFactura } from "@/app/services/factura";
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
        return NextResponse.json({ error: 'Erro ao tentar deletar o item' }, { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
      const factura = await getFacturaById(params.id); 
  
      if (!factura) {
        return NextResponse.json({ error: 'Factura ou Cotacao nao encontrada' }, { status: 404 }); 
      }
  
      return NextResponse.json(factura); 
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Error' }, { status: 500 }); /
    }
  }