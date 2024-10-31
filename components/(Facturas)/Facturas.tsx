"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaTrash, FaInfoCircle } from "react-icons/fa";

export const Facturas = () => {
  const [facturas, setFacturas] = useState([
    {
      nome: "Fatura 1",
      tipo: "Serviço",
      data: "2024-01-15",
      entidade: "Empresa A",
      valor: "150.00",
      iva: "23",
    },
    {
      nome: "Fatura 2",
      tipo: "Produto",
      data: "2024-02-20",
      entidade: "Empresa B",
      valor: "200.00",
      iva: "23",
    },
    {
      nome: "Fatura 3",
      tipo: "Serviço",
      data: "2024-03-05",
      entidade: "Empresa C",
      valor: "75.50",
      iva: "23",
    },
    {
      nome: "Fatura 4",
      tipo: "Produto",
      data: "2024-04-10",
      entidade: "Empresa D",
      valor: "300.00",
      iva: "23",
    },
    {
      nome: "Fatura 5",
      tipo: "Serviço",
      data: "2024-05-25",
      entidade: "Empresa E",
      valor: "120.75",
      iva: "23",
    },
  ]);
  const [form, setForm] = useState({
    nome: "",
    tipo: "",
    data: "",
    entidade: "",
    valor: "",
    iva: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });
  const [selectedFacturaIndex, setSelectedFacturaIndex] = useState(null);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [showDetailCard, setShowDetailCard] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const detailModalRef = useRef();
  const deleteModalRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFacturaIndex !== null) {
      const updatedFacturas = [...facturas];
      updatedFacturas[selectedFacturaIndex] = form;
      setFacturas(updatedFacturas);
      setSelectedFacturaIndex(null);
    } else {
      setFacturas([...facturas, form]);
    }

    setForm({
      nome: "",
      tipo: "",
      data: "",
      entidade: "",
      valor: "",
      iva: "",
    });
    document.getElementById("form-section").style.display = "none";
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedFacturas = React.useMemo(() => {
    let sortableItems = [...facturas];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === "valor") {
          return sortConfig.direction === "ascending"
            ? parseFloat(a[sortConfig.key]) - parseFloat(b[sortConfig.key])
            : parseFloat(b[sortConfig.key]) - parseFloat(a[sortConfig.key]);
        } else if (sortConfig.key === "data") {
          return sortConfig.direction === "ascending"
            ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
            : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
        } else {
          return sortConfig.direction === "ascending"
            ? a[sortConfig.key].localeCompare(b[sortConfig.key])
            : b[sortConfig.key].localeCompare(a[sortConfig.key]);
        }
      });
    }
    return sortableItems;
  }, [facturas, sortConfig]);

  const handleEdit = (index) => {
    setForm(facturas[index]);
    setSelectedFacturaIndex(index);
    document.getElementById("form-section").style.display = "block";
  };

  const handleSelect = (index) => {
    setSelectedIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const deleteSelected = () => {
    if (selectedIndices.length > 0) {
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    const updatedFacturas = facturas.filter(
      (_, index) => !selectedIndices.includes(index)
    );
    setFacturas(updatedFacturas);
    setSelectedIndices([]);
    setShowDeleteModal(false);
  };

  const handleSingleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmSingleDelete = () => {
    const updatedFacturas = facturas.filter(
      (_, index) => index !== deleteIndex
    );
    setFacturas(updatedFacturas);
    setDeleteIndex(null);
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectedIndices(isChecked ? facturas.map((_, index) => index) : []);
  };

  const closeDetailModal = () => {
    setShowDetailCard(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleClickOutside = (event) => {
    if (
      detailModalRef.current &&
      !detailModalRef.current.contains(event.target)
    ) {
      closeDetailModal();
    }
    if (
      deleteModalRef.current &&
      !deleteModalRef.current.contains(event.target)
    ) {
      closeDeleteModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Função para verificar se é dispositivo móvel Não apagar
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  return (
    <div className="max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto m-6 p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-4">
        Gerenciamento de Faturas
      </h1>
      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300 mb-4"
        onClick={() => {
          setForm({
            nome: "",
            tipo: "",
            data: "",
            entidade: "",
            valor: "",
            iva: "",
          });
          setSelectedFacturaIndex(null);
          document.getElementById("form-section").style.display = "block";
        }}
      >
        Criar Nova Fatura
      </button>

      {selectedIndices.length > 0 && (
        <button
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-300 mb-4"
          onClick={deleteSelected}
        >
          <FaTrash className="inline mr-2" /> Excluir Faturas Selecionadas
        </button>
      )}

      <div id="form-section" className="form-section hidden mb-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="w-full p-3 dark:bg-black border rounded-md"
          />
          <input
            type="text"
            name="tipo"
            placeholder="Tipo"
            value={form.tipo}
            onChange={handleChange}
            required
            className="w-full p-3 dark:bg-black border rounded-md"
          />
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
            required
            className="w-full p-3 dark:bg-black hover:bg-white/50 border rounded-md"
          />
          <input
            type="text"
            name="entidade"
            placeholder="Entidade"
            value={form.entidade}
            onChange={handleChange}
            required
            className="w-full p-3 dark:bg-black border rounded-md"
          />
          <input
            type="number"
            name="valor"
            placeholder="Valor"
            value={form.valor}
            onChange={handleChange}
            required
            className="w-full p-3 dark:bg-black border rounded-md"
          />
          <input
            type="number"
            name="iva"
            placeholder="IVA (%)"
            value={form.iva}
            onChange={handleChange}
            required
            className="w-full p-3 dark:bg-black border rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-300"
          >
            {selectedFacturaIndex !== null
              ? "Atualizar Fatura"
              : "Adicionar Fatura"}
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full mt-6 border-collapse">
          <thead>
            <tr>
              <th className="p-3 border-b lg:border">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedIndices.length === facturas.length}
                  className="cursor-pointer"
                  style={{ transform: "scale(1.5)" }}
                />
              </th>
              <th
                onClick={() => requestSort("nome")}
                className="cursor-pointer p-3 border-b lg:border"
              >
                Nome
              </th>
              <th
                onClick={() => requestSort("tipo")}
                className="cursor-pointer p-3 border-b lg:border"
              >
                Tipo
              </th>
              <th
                onClick={() => requestSort("data")}
                className="cursor-pointer p-3 border-b lg:border"
              >
                Data
              </th>
              <th
                onClick={() => requestSort("entidade")}
                className="cursor-pointer p-3 border-b lg:border"
              >
                Entidade
              </th>
              <th
                onClick={() => requestSort("valor")}
                className="cursor-pointer p-3 border-b lg:border"
              >
                Valor
              </th>
              <th
                onClick={() => requestSort("iva")}
                className="cursor-pointer p-3 border-b lg:border"
              >
                IVA (%)
              </th>
              <th className="p-3 border-b lg:border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedFacturas.map((factura, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer"
                onClick={() => {
                  if (isMobile()) {
                    setSelectedFactura(factura);
                    setShowDetailCard(true);
                  }
                }}
              >
                <td className="p-3 border-b">
                  <input
                    type="checkbox"
                    checked={selectedIndices.includes(index)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelect(index);
                    }}
                    className="cursor-pointer"
                    style={{ transform: "scale(1.5)" }}
                  />
                </td>
                <td className="p-3 border-b">{factura.nome}</td>
                <td className="p-3 border-b">{factura.tipo}</td>
                <td className="p-3 border-b">{factura.data}</td>
                <td className="p-3 border-b">{factura.entidade}</td>
                <td className="p-3 border-b">{factura.valor}</td>
                <td className="p-3 border-b">{factura.iva}</td>
                <td className="p-3 inline-grid lg:block border-b">
                 
                  {/* Ícone de informação apenas para telas maiores Não apagar */}
                  {!isMobile() && (
                    <button
                      className="bg-transparent text-blue-500 hover:text-blue-700 text-lg lg:mr-3 left-3 lg:left-0 lg:top-2 p-2  relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFactura(factura);
                        setShowDetailCard(true);
                      }}
                    >
                      <FaInfoCircle size={30} />
                    </button>
                  )}
                  <button
                    className="bg-yellow-500 text-white py-1 px-3 rounded mb-2 lg:mb-0 hover:bg-yellow-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(index);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 lg:ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSingleDelete(index);
                    }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmação de exclusão Modal Não apagar */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-85"
          ref={deleteModalRef}
        >
          <div className="md:w-96 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Confirmação de Exclusão
            </h2>
            <p>
              Você tem certeza que deseja excluir{" "}
              {deleteIndex !== null
                ? "esta fatura?"
                : "as faturas selecionadas?"}
            </p>
            <div className="flex justify-between mt-4">
              <button
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                onClick={
                  deleteIndex !== null ? confirmSingleDelete : confirmDelete
                }
              >
                Excluir
              </button>
              <button
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                onClick={cancelDelete}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detalhes dos Card Não apagar*/}
      {showDetailCard && selectedFactura && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75"
          ref={detailModalRef}
        >
          <div className="md:w-96 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Detalhes da Fatura</h2>
            <p>
              <strong>Nome:</strong> {selectedFactura.nome}
            </p>
            <p>
              <strong>Tipo:</strong> {selectedFactura.tipo}
            </p>
            <p>
              <strong>Data:</strong> {selectedFactura.data}
            </p>
            <p>
              <strong>Entidade:</strong> {selectedFactura.entidade}
            </p>
            <p>
              <strong>Valor:</strong> {selectedFactura.valor}
            </p>
            <p>
              <strong>IVA (%):</strong> {selectedFactura.iva}
            </p>
            <button
              className="mt-4 bg-gray-600 text-white py-2 px-4 rounded"
              onClick={closeDetailModal}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
