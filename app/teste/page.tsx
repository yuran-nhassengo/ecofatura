"use client"

import React from 'react';
import { gerarPdf, ItemCotacao } from '../../components/pdf/generatePdf';

const Home: React.FC = () => {
  // Dados de cotação
  const itensCotacao: ItemCotacao[] = [
    { descricao: 'Cimento', quantidade: 10, precoUnitario: 25.5 },
    { descricao: 'Areia', quantidade: 5, precoUnitario: 50.0 },
    { descricao: 'Blocos', quantidade: 100, precoUnitario: 1.2 },
  ];

  // Informações da empresa (6 linhas)
  const empresaInfo = [
    'Nome da Empresa Ltda.',
    'CNPJ: 12.345.678/0001-90',
    'Endereço: Rua Exemplo, 123',
    'Bairro: Centro',
    'Cidade: São Paulo',
    'Telefone: (11) 98765-4321',
  ];

  // Logo da empresa (pode ser caminho relativo para a imagem ou URL)
  const logoUrl = '/iabil-logo.jpg'; // Logo deve estar na pasta public

  const handleGerarPdf = () => {
    gerarPdf({ itens: itensCotacao, logoUrl, empresaInfo });
  };

  return (
    <div>
      <h1>Bem-vindo à nossa Loja de Materiais!</h1>
      <button onClick={handleGerarPdf}>Gerar PDF</button>
    </div>
  );
};

export default Home;
