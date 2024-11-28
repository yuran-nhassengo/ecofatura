import { PrismaClient } from "@prisma/client";
import { Produto } from "../types/Factura";


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
    valor: number,
    descricao:string,
    nuit: number,
    produtos: Produto[]

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
                produtos: {
                    create: produtos.map((produto) => ({
                        nome: produto.nome,
                        quantidade: produto.quantidade,
                        valor: produto.valor,
                        total: produto.total, // Calculado anteriormente no frontend
                    })),
                }
            },
    });

    return factura;
};

export const getAllFacturas = async () => {
    const facturas = await prisma.factura.findMany({
        include: {
            produtos: true, // Incluindo os produtos associados a cada fatura
        },
    });
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
        produtos?: Produto[];
    }
) => {

    if (!isValidCUID(id)) {
        throw new Error('ID fornecido não é um CUID válido.');
    }

    const updatedData: any = {
        ...data,
        updatedAt: new Date(),  // Define a data atual como a data de atualização
      };
    
    const factura = await prisma.factura.update({
        where: { id },
        data: updatedData,
    });

    // if (data.produtos) {
    //     // Atualizando produtos relacionados à fatura
    //     for (const produto of data.produtos) {
    //       // Atualizando cada produto individualmente
    //       await prisma.produto.upsert({
    //         where: { id: produto.id },  // Usando o ID do produto para atualizar ou criar
    //         update: {
    //           nome: produto.nome,
    //           quantidade: produto.quantidade,
    //           valor: produto.valor,
    //           total: produto.total,
    //         },
    //         create: {
    //           nome: produto.nome,
    //           quantidade: produto.quantidade,
    //           valor: produto.valor,
    //           total: produto.total,
    //           facturaId: id,  // Relacionando o produto à fatura
    //         },
    //       });
    //     }
    //   }

    return factura; 
};

export const deleteFactura = async (id: string) => {
    const factura = await prisma.factura.delete({
        where: { id }
    });
    return factura; 
};