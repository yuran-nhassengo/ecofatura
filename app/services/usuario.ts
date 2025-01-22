import { PrismaClient } from "@prisma/client";

import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();


export const createUser = async (

    nome: string,
    apelido:string,           
    email: string,          
    dataNascimento: string, 
    senha: string,

) => {

    
    const usuario = await prisma.usuario.create({
        data:{
            nome,
            apelido,
            email,
            dataNascimento,
            senha,
        },
    });
    console.log("O service.....",usuario)
    return usuario;

}


export const getAllUser = async () => {

    const usuarios = await prisma.usuario.findMany();

    return usuarios;
}

export const getUsuarioById = async (id: string) =>{
    const factura = await prisma.usuario.findUnique({
        where: {id}
    });

    return factura;
}

export const updateUsuario = async (
    id:string,
    data: {
        nome?: string;
        apelido?: string;
        email?: string;
        dataNascimento?: string;
        senha?: string;
    }
) => {
    const updateData: any = {
        ...data,
        updatedAt: new Date(),
    };

    const usuario = await prisma.usuario.update({
        where:{id},
        data: updateData
    });

    return usuario;
};

export const deleteUsuario = async (id: string) =>{

    const usuario  =  await prisma.usuario.delete({
        where: {id}
    });

    return usuario;
}

export const loginUser = async (email: string, senha: string) => {
    // Buscar o usuário pelo e-mail
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });
  
    // Verificar se o usuário existe
    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }
  
    // Comparar a senha fornecida com a senha armazenada (criptografada)
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
  
    if (!senhaValida) {
      throw new Error("Senha inválida");
    }
  
    // Retornar o usuário se a senha for válida
    return usuario;
  };