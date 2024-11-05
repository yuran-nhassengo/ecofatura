export interface FacturaCreate {
    codigo: string;
    nome: string;
    tipo: string;
    data: string;
    entidade: string;
    valor: string;
    descricao: string;
    nuit: number ;
  }

  export interface Factura extends FacturaCreate {
    id: string;  // O Prisma vai gerar o ID automaticamente
  }