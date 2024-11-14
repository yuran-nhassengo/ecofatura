import { jsPDF } from 'jspdf';

export interface ItemCotacao {
  descricao: string;
  quantidade: number;
  precoUnitario: number;
}

interface CotacaoProps {
  itens: ItemCotacao[];
  logoUrl: string;
  empresaInfo: string[];
}

export const gerarPdf = ({ itens, logoUrl, empresaInfo }: CotacaoProps) => {
  const doc = new jsPDF();

  // Nova margem para mover a informação da empresa e a linha vertical para a direita
  const novaMargemX = 130;  // Aumenta a distância entre o logo e as informações da empresa

  // Adicionar logo da empresa
  const logoX = 55;
  const logoY = 8;
  const logoWidth = 40;
  const logoHeight = 30;
  doc.addImage(logoUrl, 'JPEG', logoX, logoY+8, logoWidth, logoHeight);

  // Informações da empresa ao lado do logo
  let yOffset = logoY;
  doc.setFontSize(12);
  doc.text('', novaMargemX, yOffset);
  yOffset += 10;

  empresaInfo.forEach((linha, index) => {
    doc.text(linha, novaMargemX, yOffset + (index * 8)); // 8px de espaçamento entre linhas
  });

  // Linha separadora vertical entre o logo e as informações da empresa
  doc.setLineWidth(0.5);
  // Ajustando a linha vertical para a nova margem
  doc.line(novaMargemX - 5, logoY, novaMargemX - 5, yOffset + empresaInfo.length * 8);

  

  // Adicionar lista de itens
  yOffset += (empresaInfo.length + 2) * 8; // Ajustar para começar após a linha
  doc.setLineWidth(0.3);  // Define a espessura da linha
  doc.line(60, yOffset + 5, 200, yOffset + 5);  // Linha horizontal entre as colunas
  yOffset += 10;
  doc.setFontSize(10);
  doc.text('Descrição', 60, yOffset);
  doc.text('Quantidade', 120, yOffset);
  doc.text('Preço Unitário', 140, yOffset);
  doc.text('Total', 180, yOffset);

  doc.setLineWidth(0.3);  // Define a espessura da linha
     doc.line(60, yOffset + 5, 200, yOffset + 5);  // Linha horizontal entre as colunas
     yOffset += 10; 

  itens.forEach((item) => {
    doc.text(item.descricao, 60, yOffset);
    doc.text(String(item.quantidade), 120, yOffset);
    doc.text(`R$ ${item.precoUnitario.toFixed(2)}`, 140, yOffset);
    doc.text(`R$ ${(item.quantidade * item.precoUnitario).toFixed(2)}`, 180, yOffset);

     // Desenhar uma linha horizontal após o item
     doc.setLineWidth(0.3);  // Define a espessura da linha
     doc.line(60, yOffset + 5, 200, yOffset + 5);  // Linha horizontal entre as colunas
     yOffset += 10;  // Ajusta a altura para o próximo item
  });

  // Resumo de valores (Subtotal, IVA, Total)
  const subtotal = itens.reduce((sum, item) => sum + item.quantidade * item.precoUnitario, 0);
  const iva = subtotal * 0.15; // Exemplo de IVA de 15%
  const total = subtotal + iva;

  yOffset += 4;
  doc.setFontSize(10);
  doc.text(`Subtotal`, 60, yOffset);
  doc.text(`MZN ${subtotal.toFixed(2)}`, 180, yOffset);
  doc.setLineWidth(0.3);  // Define a espessura da linha
     doc.line(60, yOffset + 5, 200, yOffset + 5);  // Linha horizontal entre as colunas
     yOffset += 10;  // Ajusta a altura para o próximo item

  doc.text(`IVA (15%) `, 60, yOffset);
  doc.text(` MZN ${iva.toFixed(2)}`, 180, yOffset);
  doc.setLineWidth(0.3);  // Define a espessura da linha
     doc.line(60, yOffset + 5, 200, yOffset + 5);  // Linha horizontal entre as colunas
     yOffset += 10;  // Ajusta a altura para o próximo item

  doc.text(`Total `, 60, yOffset);
  doc.text(`MZN ${total.toFixed(2)}`, 180, yOffset);
  doc.line(60, yOffset + 5, 200, yOffset + 5);  // Linha horizontal entre as colunas
     yOffset += 10;  // Ajusta a altura para o próximo item
  // Gerar e baixar o PDF
  doc.save('cotacao.pdf');
};
