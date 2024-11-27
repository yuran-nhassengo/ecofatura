import React from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isMultiple: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  isMultiple,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-85">
      <div className="md:w-96 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Confirmação de Exclusão</h2>
        <p>
          Você tem certeza que deseja excluir{" "}
          {isMultiple ? "as faturas selecionadas?" : "esta fatura?"}
        </p>
        <div className="flex justify-between mt-4">
          <button
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Excluir
          </button>
          <button
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
