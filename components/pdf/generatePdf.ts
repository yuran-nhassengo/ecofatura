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



  yOffset += (empresaInfo.length + 2) * 8;
  let  h2yO = yOffset ;
  doc.setFontSize(30);
  doc.text('Factura de Serviço', 10, yOffset);
  yOffset += 10;
  doc.setFontSize(10);
  doc.text('Número da factura:', 45, yOffset);
  doc.text('1010/2024', 77, yOffset);
  yOffset += 10;
  doc.text('Data de emissão:', 45, yOffset);
  doc.text('21/08/2024', 75, yOffset);
  yOffset += 10;
  doc.text('Data de vencimento:', 45, yOffset);
  doc.text('31/08/2024', 79, yOffset);

  doc.setFontSize(17);
  doc.text('Emitida para', 110,h2yO);
  h2yO +=10;
  doc.setFontSize(10);
  doc.text('Ancha Abudo', 110, h2yO);
  h2yO +=5;
  doc.text('aa.abudo@gmail.com', 110, h2yO);


  // Adicionar lista de itens
  yOffset += (empresaInfo.length + 2) * 2; 
  doc.setLineWidth(0.3);  
  doc.line(60, yOffset + 5, 200, yOffset + 5);  
  yOffset += 10;
  doc.setFontSize(10);
  doc.text('Descrição', 60, yOffset);
  doc.text('Quantidade', 120, yOffset);
  doc.text('Preço Unitário', 140, yOffset);
  doc.text('Total', 180, yOffset);

  doc.setLineWidth(0.3); 
     doc.line(60, yOffset + 5, 200, yOffset + 5);  
     yOffset += 10; 

  itens.forEach((item) => {
    doc.text(item.descricao, 60, yOffset);
    doc.text(String(item.quantidade), 120, yOffset);
    doc.text(`R$ ${item.precoUnitario.toFixed(2)}`, 140, yOffset);
    doc.text(`R$ ${(item.quantidade * item.precoUnitario).toFixed(2)}`, 180, yOffset);

     
     doc.setLineWidth(0.3);  
     doc.line(60, yOffset + 5, 200, yOffset + 5);  
     yOffset += 10;  
  });

 
  const subtotal = itens.reduce((sum, item) => sum + item.quantidade * item.precoUnitario, 0);
  const iva = subtotal * 0.15; 
  const total = subtotal + iva;
  const prestacao = total *0.30;

  yOffset += 4;
  doc.setFontSize(10);
  doc.text(`Subtotal`, 60, yOffset);
  doc.text(`MZN ${subtotal.toFixed(2)}`, 180, yOffset);
  doc.setLineWidth(0.3);  
     doc.line(60, yOffset + 5, 200, yOffset + 5);  
     yOffset += 10;  

  doc.text(`IVA (15%) `, 60, yOffset);
  doc.text(` MZN ${iva.toFixed(2)}`, 180, yOffset);
  doc.setLineWidth(0.3);  
     doc.line(60, yOffset + 5, 200, yOffset + 5);  
     yOffset += 10;  

  doc.text(`Total `, 60, yOffset);
  doc.text(`MZN ${total.toFixed(2)}`, 180, yOffset);
  doc.line(60, yOffset + 5, 200, yOffset + 5);  
     yOffset += 10; 
     
  doc.text(`Valor a pagar (30% do valor Total) `, 60, yOffset);
  doc.text(`MZN ${prestacao.toFixed(2)}`, 180, yOffset);
  doc.line(60, yOffset + 5, 200, yOffset + 5);  
  yOffset += 15; 
     let pgoY = yOffset;
     doc.setFontSize(15);
     doc.text(`Informações para `, 60, yOffset);
     yOffset += 10;
     doc.text(`Pagamento`, 60, yOffset); 
     yOffset += 10;
 
     doc.setFontSize(10);
  doc.text(`Banco:`, 60, yOffset);
  doc.text(`Standard Bank`, 72, yOffset);
  yOffset += 10;
  
  doc.text(`Numero da Conta:`, 60, yOffset);
  doc.text(`28363651725618`, 90, yOffset);
  yOffset += 10;
  
  doc.text(`Nib:`, 60, yOffset);
  doc.text(`28363651725618`, 67, yOffset);
  yOffset += 10;

  doc.setFontSize(15);
  doc.text(`Notas:`, 125, pgoY);
  pgoY +=10
  doc.setFontSize(10);
  doc.text(`Esta é a segunda das três facturas que \n serão emitidas, na seguinte ordem:`, 125, pgoY);
  
  
  doc.save('cotacao.pdf');
};