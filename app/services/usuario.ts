import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


export const createUser = async (

    nome: string,           
    email: string,          
    dataNascimento: string, 
    senha: string,

) => {

    const Usuario = await prisma.usuario.create({
        data:{
            nome,
            email,
            dataNascimento,
            senha,
        },
    });

    return Usuario;

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