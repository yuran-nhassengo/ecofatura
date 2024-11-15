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

  export interface ItemCotacao {
    descricao: string;
    precoUnitario: number;
  }

  export interface CotacaoProps {
    itens: ItemCotacao[];
    logoUrl: string;
    empresaInfo: string[];
  }