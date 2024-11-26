import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

// Função para validar CUID
const isValidCUID = (id: string): boolean => {
    const cuidRegex = /^[a-z0-9]{25}$/; // Padrão para CUID
    return cuidRegex.test(id);
};


export const createFactura = async (

    codigo: string,
    nome: string,
    tipo: string,
    data: string,
    entidade: string,
    valor: string,
    descricao:string,
    nuit: number

) => {
    const factura = await prisma.factura.create({
            data:{
                codigo,
                nome,
                tipo,
                data,
                entidade,
                valor,
                descricao,
                nuit,
                produtos 
            },
    });

    return factura;
};

export const getAllFacturas = async () => {
    const facturas = await prisma.factura.findMany();
    return facturas; 
};

export const getFacturaById = async (id: string) => {
    const factura = await prisma.factura.findUnique({
        where: { id }
    });
    return factura; 
};

export const updateFactura = async (
    id: string,
    data: {
        codigo?: string;
        nome?: string;
        tipo?: string;
        data?: string;
        entidade?: string;
        valor?: string;
        descricao?: string;
        nuit?: number;
    }
) => {

    if (!isValidCUID(id)) {
        throw new Error('ID fornecido não é um CUID válido.');
    }
    
    const factura = await prisma.factura.update({
        where: { id },
        data
    });
    return factura; 
};

export const deleteFactura = async (id: string) => {
    const factura = await prisma.factura.delete({
        where: { id }
    });
    return factura; 
};