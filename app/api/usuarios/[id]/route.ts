import { deleteUsuario, getUsuarioById, updateUsuario } from "@/app/services/usuario";
import { NextRequest, NextResponse } from "next/server";



export async function PUT (
    request: NextRequest,
    {params}: {params: Promise<{id: string}>}
){
    const {id} = await params;
    const body = await request.json();

    try {
        const updatedUsuario = await updateUsuario(id,body);

        return NextResponse.json(updateUsuario);
    }catch (error) {
        return NextResponse.json(
            { error: `Failed to update invoice: ${error}` },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } 
){
    const { id } = await params;
    try {
        const deleteUser = await deleteUsuario(id);
        return NextResponse.json(deleteUser);
    }catch(error){
        return NextResponse.json(
            { error: `Error deleting the item: ${error}` },
            { status: 500 }
          );
    }
}

export async function GET(
    request: NextRequest,
    {params} : {params: Promise<{id: string}>}
){
    const {id} = await params;

    try{
        const usuario = await getUsuarioById(id);

        if(!usuario){
            return NextResponse.json({ error: `Factura not found` }, { status: 404 });
        }

        return NextResponse.json(usuario);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: `Error: ${error}` }, { status: 500 });
      }
}