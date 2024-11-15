import { deleteFactura, getFacturaById, updateFactura } from "@/app/services/factura";
import { NextRequest, NextResponse } from "next/server";

// PUT - Atualizar fatura
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params é agora uma Promise
) {
  const { id } = await params; // Aguarde a resolução dos parâmetros
  const body = await request.json();
  try {
    const updatedFactura = await updateFactura(id, body);
    return NextResponse.json(updatedFactura);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update invoice: ${error}` },
      { status: 500 }
    );
  }
}

// DELETE - Deletar fatura
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params é agora uma Promise
) {
  const { id } = await params; // Aguarde a resolução dos parâmetros
  try {
    const deletedFactura = await deleteFactura(id);
    return NextResponse.json(deletedFactura);
  } catch (error) {
    return NextResponse.json(
      { error: `Error deleting the item: ${error}` },
      { status: 500 }
    );
  }
}

// GET - Obter fatura
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params é agora uma Promise
) {
  const { id } = await params; // Aguarde a resolução dos parâmetros
  try {
    const factura = await getFacturaById(id);

    if (!factura) {
      return NextResponse.json({ error: `Factura not found` }, { status: 404 });
    }

    return NextResponse.json(factura);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: `Error: ${error}` }, { status: 500 });
  }
}
