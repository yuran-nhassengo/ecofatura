import { createUser, getAllUser, loginUser } from "@/app/services/usuario";
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

    console.log("Chegada api..",body);

    try {

        const {nome,apelido,email,dataNascimento,senha} = body;
        const newUser = await createUser(nome,apelido,email,dataNascimento,senha);

        return NextResponse.json(newUser, {status: 201});
    }catch (error){

        return NextResponse.json({ error: `erro ${error}`  }, { status: 500 });
        
    }
}

export async function LOGIN(request: Request) {
    const body = await request.json();
  
    try {
      const { email, senha } = body;
      const usuario = await loginUser(email, senha);
  
      // Retornar o usuário sem a senha, por questões de segurança
      const { senha: _, ...userWithoutPassword } = usuario;
  
      return NextResponse.json(userWithoutPassword, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: `Erro: ${error}` }, { status: 401 }); // Unauthorized
    }
  }