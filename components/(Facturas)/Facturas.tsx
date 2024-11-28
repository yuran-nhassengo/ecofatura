"use client";

import { Factura, FacturaCreate, ItemCotacao } from "@/app/types/Factura";
import React, { useState, useRef, useEffect } from "react";
import { FaTrash, FaInfoCircle } from "react-icons/fa";
import { gerarPdf } from "../pdf/generatePdf";

import empresaInfo from "../../components/pdf/empresaInfo";
import { ItensCotacao } from "../../components/pdf/itensCotacao";
import { FacturaForm } from "./facturaform";
import { DeleteModal } from "./deletemodal";
import { FacturaDetailModal } from "./deitailsmodal";

const useScreenSize = () => {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenWidth(window.innerWidth);
    };

    updateScreenSize();

    window.addEventListener("resize", updateScreenSize);

    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  const isMiniphone = screenWidth <= 359;
  const isMobile = screenWidth <= 780;
  const isMin = screenWidth <= 1170;

  return { isMiniphone, isMobile, isMin };
};

const IVA_FIXED = 16;
const logo = "/binario.jpg";
export const Facturas: React.FC = () => {
  const { isMiniphone, isMobile, isMin } = useScreenSize();

  const [facturas, setFacturas] = useState<Factura[]>([]);

  const [editingFactura, setEditingFactura] = useState<Factura | null>(null);

  const handleGerarPdf = (
    logoUrl: string,
    empresaInfo: string[],
    itens: ItemCotacao[],
    factura: FacturaCreate
  ) => {
    gerarPdf({ itens, logoUrl, empresaInfo }, factura);
  };

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({
    key: "",
    direction: "ascending",
  });

  const [selectedFacturaIndex, setSelectedFacturaIndex] = useState<
    number | null
  >(null);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [showDetailCard, setShowDetailCard] = useState<boolean>(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const detailModalRef = useRef<HTMLDivElement | null>(null);
  const deleteModalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchFacturas = async () => {
      const response = await fetch("/api/facturas");
      const data = await response.json();
      setFacturas(data);
    };

    fetchFacturas();
  }, []);

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedFacturas = React.useMemo(() => {
    return Array.isArray(facturas)
      ? [...facturas].sort((a: Factura, b: Factura) => {
          if (sortConfig.key) {
            const key = sortConfig.key as keyof Factura;

            if (key === "valor") {
              const aValue = parseFloat(a[key] as string);
              const bValue = parseFloat(b[key] as string);
              return sortConfig.direction === "ascending"
                ? aValue - bValue
                : bValue - aValue;
            } else if (key === "data") {
              const aDate = new Date(a[key] as string | Date).getTime();
              const bDate = new Date(b[key] as string | Date).getTime();
              return sortConfig.direction === "ascending"
                ? aDate - bDate
                : bDate - aDate;
            } else {
              const aString = String(a[key]);
              const bString = String(b[key]);
              return sortConfig.direction === "ascending"
                ? aString.localeCompare(bString)
                : bString.localeCompare(aString);
            }
          }
          return 0;
        })
      : [];
  }, [facturas, sortConfig]);

  const handleEdit = (index: number) => {
    setEditingFactura(facturas[index]);

    console.log("encontrei...",facturas[index]);

    setSelectedFacturaIndex(index);
    //document.getElementById("form-section")!.style.display = "block";
  };

  const deleteSelected = () => {
    if (selectedIndices.length > 0) {
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    const facturasToDelete = selectedIndices.map((index) => facturas[index]);

    try {
      for (const factura of facturasToDelete) {
        await fetch(`/api/facturas/${factura.id}`, {
          method: "DELETE",
        });
      }

      const updatedFacturas = facturas.filter(
        (_, index) => !selectedIndices.includes(index)
      );
      setFacturas(updatedFacturas);
      setSelectedIndices([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Erro ao excluir faturas", error);
    }
  };

  const handleSingleDelete = (index: number) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmSingleDelete = async () => {
    const facturaToDelete = facturas[deleteIndex!];

    try {
      await fetch(`/api/facturas/${facturaToDelete.id}`, {
        method: "DELETE",
      });

      const updatedFacturas = facturas.filter(
        (_, index) => index !== deleteIndex
      );
      setFacturas(updatedFacturas);
      setDeleteIndex(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Erro ao excluir fatura", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleSelect = (index: number) => {
    const newSelectedIndices = selectedIndices.includes(index)
      ? selectedIndices.filter((i) => i !== index)
      : [...selectedIndices, index];
    setSelectedIndices(newSelectedIndices);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectedIndices(isChecked ? facturas.map((_, index) => index) : []);
  };

  const closeDetailModal = () => {
    setShowDetailCard(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      detailModalRef.current &&
      !detailModalRef.current.contains(event.target as Node)
    ) {
      closeDetailModal();
    }
    if (
      deleteModalRef.current &&
      !deleteModalRef.current.contains(event.target as Node)
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

  const calculateTotalWithIVA = (valor: number) => {
    return (valor * (1 + IVA_FIXED / 100)).toFixed(2);
  };

  return (
    <div className="max-w-2xl md:max-w-4xl lg:max-w-6xl 2xl:max-w-7xl mx-auto m-6 p-6 rounded-lg shadow-lg ">
      <h1 className="text-3xl font-semibold text-center mb-8">
        Gerenciamento de Faturas
      </h1>
      <FacturaForm />

      {selectedIndices.length > 0 && (
        <button
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-300 mb-4"
          onClick={deleteSelected}
        >
          <FaTrash className="inline mr-2" /> Excluir Faturas Selecionadas
        </button>
      )}

      {/* Aqui Começa a tabela */}

      <div className="overflow-x-auto">
        <table className="min-w-full mt-6 border-collapse">
          <thead>
            <tr>
              {!isMobile && (
                <th className="p-3 border-b 2xl:border">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIndices.length === facturas.length}
                    className="cursor-pointer"
                    style={{ transform: "scale(1.5)" }}
                  />
                </th>
              )}
              <th
                onClick={() => requestSort("codigo")}
                className="cursor-pointer p-3 border-b 2xl:border"
              >
                Código
              </th>

              {!isMobile && (
                <th
                  onClick={() => requestSort("nome")}
                  className="cursor-pointer p-3 border-b 2xl:border"
                >
                  Nome
                </th>
              )}
              {!isMiniphone && (
                <th
                  onClick={() => requestSort("data")}
                  className="cursor-pointer p-3 border-b 2xl:border"
                >
                  Data
                </th>
              )}
              {!isMobile && (
                <th
                  onClick={() => requestSort("nuit")}
                  className="cursor-pointer p-3 border-b 2xl:border"
                >
                  Nuit
                </th>
              )}
              {!isMobile ||
                (!isMin && (
                  <th
                    onClick={() => requestSort("tipo")}
                    className="cursor-pointer p-3 border-b 2xl:border"
                  >
                    Tipo
                  </th>
                ))}
              {!isMobile ||
                (!isMin && (
                  <th
                    onClick={() => requestSort("entidade")}
                    className="cursor-pointer p-3 border-b 2xl:border"
                  >
                    Entidade
                  </th>
                ))}
              <th
                onClick={() => requestSort("valor")}
                className="cursor-pointer p-3 border-b 2xl:border"
              >
                Valor
              </th>
              {!isMobile && (
                <th className="p-3 border-b 2xl:border">
                  Total com IVA (%{IVA_FIXED})
                </th>
              )}

              <th className="p-3 border-b 2xl:border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedFacturas.map((factura, index) => (
              <tr
                key={index}
                

                className="hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer"
                onClick={() => {
                  if (isMobile) {
                    setSelectedFactura(factura);
                    setShowDetailCard(true);
                  }
                }}
              >
                {!isMobile && (
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
                )}
                <td className="p-3 border-b text-center">{factura.codigo}</td>
                {!isMobile && (
                  <td className="p-3 border-b text-center">{factura.nome}</td>
                )}
                {!isMiniphone && (
                  <td className="p-3 border-b text-center">{factura.data}</td>
                )}
                {!isMobile && (
                  <td className="p-3 border-b text-center">{factura.nuit}</td>
                )}
                {!isMobile ||
                  (!isMin && (
                    <td className="p-3 border-b text-center">{factura.tipo}</td>
                  ))}
                {!isMobile ||
                  (!isMin && (
                    <td className="p-3 border-b text-center">
                      {factura.entidade}
                    </td>
                  ))}
                <td className="p-3 border-b text-center">{factura.valor}</td>
                {!isMobile && (
                  <td className="p-3 border-b text-center">
                    {calculateTotalWithIVA(factura.valor)}
                  </td>
                )}
                <td className="p-3 inline-grid lg:block border-b">
                  {!isMobile && (
                    <button
                      className="bg-transparent text-blue-500 hover:text-blue-700 text-lg lg:mr-3 left-3 lg:left-0 lg:top-2 p-2 relative"
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
                    className="bg-blue-500 text-white py-1 px-2 rounded mb-2 hover:bg-blue-600"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedFactura(factura);
                      handleGerarPdf(logo, empresaInfo, ItensCotacao, factura);
                    }}
                  >
                    PDF
                  </button>
                  <button
                    className="bg-yellow-500 text-white py-1 px-2 rounded mb-2 lg:ml-2 hover:bg-yellow-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(index);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 lg:ml-2"
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

      {/* Renderiza DeleteModal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onCancel={cancelDelete}
        onConfirm={deleteIndex !== null ? confirmSingleDelete : confirmDelete}
        isMultiple={selectedIndices.length > 0}
      />
      {/* Renderiza DetailModal */}

      {showDetailCard && selectedFactura && (
        <FacturaDetailModal
          factura={selectedFactura}
          onClose={closeDetailModal}
          IVA_FIXED={IVA_FIXED}
        />
      )}
    </div>
  );
};
