export interface FacturaCreate {
    codigo: string;
    nome: string;
    tipo: string;
    data: string;
    entidade: string;
    valor: number;
    descricao: string;
    nuit: number ;
    produtos: Produto[]
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

  export interface Produto  {
    id:string
    nome: string;
    quantidade:  number ;
    valor: number ;
    total: number;
}

export interface FacturaFormProps {
  openForm?: boolean; // Controla a visibilidade do formulário
  defaultFactura?: FacturaCreate; // Dados iniciais para preencher o formulário
}


