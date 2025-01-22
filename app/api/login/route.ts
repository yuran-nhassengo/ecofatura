import { loginUser } from "@/app/services/usuario";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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