import { createFactura, deleteFactura, getAllFacturas, updateFactura } from "@/app/services/factura";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const facturas = await getAllFacturas();
        return NextResponse.json(facturas);
    } catch (error) {
        return NextResponse.json({ error: `Erro ${error}` }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const { codigo, nome, tipo, data, entidade, valor, descricao, nuit } = body;
        const newFactura = await createFactura(codigo, nome, tipo, data, entidade, valor, descricao, nuit);
        return NextResponse.json(newFactura, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `erro ${error}`  }, { status: 500 });
    }
}


