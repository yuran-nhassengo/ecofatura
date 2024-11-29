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

      if (data.produtos && data.produtos.length > 0) {
        updatedData.produtos = {
          upsert: data.produtos.map((produto) => ({
            where: { id: produto.id }, // Buscando pelo ID do produto
            update: {
              nome: produto.nome,
              quantidade: produto.quantidade,
              valor: produto.valor,
              total: produto.total, // A lógica do total será mantida
            },
            create: {
              nome: produto.nome,
              quantidade: produto.quantidade,
              valor: produto.valor,
              total: produto.total,
            },
          })),
        };
      }
    
    const factura = await prisma.factura.update({
        where: { id },
        data: updatedData,
        include: {
            produtos: true, // Inclui os produtos associados na resposta
          },
    });

    

    return factura; 
};

export const deleteFactura = async (id: string) => {

    await prisma.produto.deleteMany({
        where: { facturaId: id }
      }); 

      
    const factura = await prisma.factura.delete({
        where: { id }
    });
    return factura; 
};