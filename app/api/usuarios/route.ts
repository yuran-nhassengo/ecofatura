import { createUser, getAllUser } from "@/app/services/usuario";
import { NextResponse } from "next/server";


export async function GET() {

    try {
        const usuarios = await getAllUser();
        return NextResponse.json(usuarios);
    } catch(error){
        return NextResponse.json({ error: `Erro ${error}` }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const body = await request.json();

    try {

        const {nome,email,dataNascimento,senha} = body;
        const newUser = await createUser(nome,email,dataNascimento,senha);

        return NextResponse.json(newUser, {status: 201});
    }catch (error){

        return NextResponse.json({ error: `erro ${error}`  }, { status: 500 });
        
    }
}