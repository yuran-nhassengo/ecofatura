import React from "react";

interface Factura {
  codigo: string;
  nome: string;
  data: string;
  nuit: number;
  valor: string;
  tipo: string;
  entidade: string;
  descricao: string;
}

interface FacturaDetailModalProps {
  factura: Factura;
  onClose: () => void;
  IVA_FIXED: number;
}

export const FacturaDetailModal: React.FC<FacturaDetailModalProps> = ({
  factura,
  onClose,
  IVA_FIXED,
}) => {
  const calculateTotalWithIVA = (valor: string) => {
    return (parseFloat(valor) * (1 + IVA_FIXED / 100)).toFixed(2);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
      <div className="md:w-96 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Detalhes da {factura.tipo}
        </h2>
        <p>
          <strong>Código:</strong> {factura.codigo}
        </p>
        <p>
          <strong>Nome:</strong> {factura.nome}
        </p>
        <p>
          <strong>Data:</strong> {factura.data}
        </p>
        <p>
          <strong>Nuit:</strong> {factura.nuit}
        </p>
        <p>
          <strong>Valor:</strong> {factura.valor}
        </p>
        <hr className="my-4" />
        <p>
          <strong>Tipo:</strong> {factura.tipo}
        </p>
        <p>
          <strong>Entidade:</strong> {factura.entidade}
        </p>

        <p>
          <strong>Descrição:</strong> {factura.descricao}
        </p>
        <p>
          <strong>Total com IVA:</strong> {calculateTotalWithIVA(factura.valor)}
        </p>

        <button
          className="mt-4 bg-gray-600 text-white py-2 px-4 rounded"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
