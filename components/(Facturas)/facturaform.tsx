import React, { useState } from "react";
import { HiTrash } from "react-icons/hi";

export const FacturaForm = () => {
  const [formData, setForm] = useState({
    tipo: "",
    data: "",
    codigo: "",
    nome: "",
    nuit: "",
    entidade: "",
    descricao: "",
    produtos: [],
  });

  const [formStep, setFormStep] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...formData, [name]: value });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProdutos = [...formData.produtos];
    updatedProdutos[index][field] = value;

    if (field === "quantidade" || field === "valor") {
      const quantidade = parseFloat(updatedProdutos[index].quantidade || 0);
      const valor = parseFloat(updatedProdutos[index].valor || 0);
      updatedProdutos[index].total = quantidade * valor;
    }

    setForm({ ...formData, produtos: updatedProdutos });
  };

  const addProduct = () => {
    setForm({
      ...formData,
      produtos: [
        ...formData.produtos,
        { nome: "", quantidade: 0, valor: 0, total: 0 },
      ],
    });
  };

  const removeProduct = (index) => {
    const updatedProdutos = formData.produtos.filter((_, i) => i !== index);
    setForm({ ...formData, produtos: updatedProdutos });
  };

  const calculateTotal = () => {
    return formData.produtos
      .reduce((sum, produto) => sum + produto.total, 0)
      .toFixed(2);
  };

  const handleNextStep = () => {
    setFormStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setFormStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleCreateNewFactura = () => {
    setFormStep(0);
    setIsFormVisible(true);
  };

  const handleSubmit = () => {
    console.log("Form Submitted", formData);
    setForm({
      tipo: "",
      data: "",
      codigo: "",
      nome: "",
      nuit: "",
      entidade: "",
      descricao: "",
      produtos: [],
    });
    setIsFormVisible(false);
  };

  const handleCancel = () => {
    setForm({
      tipo: "",
      data: "",
      codigo: "",
      nome: "",
      nuit: "",
      entidade: "",
      descricao: "",
      produtos: [],
    });
    setFormStep(0);
  };
  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const renderProgress = () => {
    const steps = [
      "Informações Gerais",
      "Detalhes de Factura",
      "Produtos",
      "Resumo",
    ];
    return (
      <div className="mb-6">
        <div className="flex justify-between mb-2 flex-wrap">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`w-full sm:w-1/4 text-center cursor-pointer ${
                formStep === index ? "font-bold text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setFormStep(index)} // Adiciona o evento de clique
            >
              {step}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full"
            style={{ width: `${(formStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto rounded-lg shadow-lg">
      {!isFormVisible && (
        <button
          onClick={handleCreateNewFactura}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300 mb-4"
        >
          Criar Nova Factura
        </button>
      )}

      {isFormVisible && (
        <div className="shadow-md rounded-lg p-4 lg:p-6 mt-6">
          <h1 className="text-2xl font-bold mb-4">Formulario de Factura</h1>

          {renderProgress()}

          {formStep === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                <div>
                  <label className="block">Tipo:</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="w-full min-w-[200px] mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 appearance-none"
                  >
                    <option value="" disabled>
                      Selecione o tipo
                    </option>
                    <option value="Factura">Factura</option>
                    <option value="Cotação">Cotação</option>
                  </select>
                </div>

                <div>
                  <label className="block">Data:</label>
                  <input
                    type="date"
                    name="data"
                    value={formData.data}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-2 border border-gray-300  rounded-md bg-white  text-gray-900 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                    placeholder="Selecione a data"
                  />
                </div>
              </div>

              <div>
                <label className="block">Código da Factura:</label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                  placeholder="Insira o código da factura"
                />
              </div>

              <div>
                <label className="block">Nome da Factura:</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                  placeholder="Insira o nome da factura"
                />
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="bg-red-500 dark:bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 dark:hover:bg-red-800"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-green-500 dark:bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 dark:hover:bg-green-800"
                >
                  Limpar
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-blue-500 dark:bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-800"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}

          {formStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block ">NUIT:</label>
                <input
                  type="text"
                  name="nuit"
                  value={formData.nuit}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                  placeholder="Insira o NUIT"
                />
              </div>

              <div>
                <label className="block ">Entidade:</label>
                <input
                  type="text"
                  name="entidade"
                  value={formData.entidade}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                  placeholder="Insira a entidade"
                />
              </div>

              <div>
                <label className="block ">Descrição da Factura:</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                  rows="3"
                  placeholder="Insira a descrição da factura"
                ></textarea>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}

          {formStep === 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 ">Produtos</h3>
              {formData.produtos.map((produto, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-center gap-4 mb-4 p-4 dark:bg-gray-800 bg-gray-50 rounded-md"
                >
                  <div className="w-full md:w-2/5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Nome do Produto
                    </label>
                    <input
                      type="text"
                      placeholder="Nome do Produto"
                      value={produto.nome}
                      onChange={(e) =>
                        handleProductChange(index, "nome", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                    />
                  </div>

                  <div className="w-full md:w-1/5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      placeholder="Quantidade"
                      value={produto.quantidade}
                      onChange={(e) =>
                        handleProductChange(index, "quantidade", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                    />
                  </div>

                  <div className="w-full md:w-1/5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Valor
                    </label>
                    <input
                      type="number"
                      placeholder="Valor Unitário"
                      value={produto.valor}
                      onChange={(e) =>
                        handleProductChange(index, "valor", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800"
                    />
                  </div>
                  <div className="w-full md:w-1/5 flex items-center justify-between">
                    <span className="md:mt-3">
                      Total: {produto.total.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeProduct(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <HiTrash size={24} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addProduct}
                className=" bg-blue-500 text-white px-3 mb-8 md:px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Adicionar Produto
              </button>
              <div className="text-right">
                <h3 className="text-xl font-bold ">
                  Total Geral: {calculateTotal()}
                </h3>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}

          {formStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Resumo da Factura</h2>
              <div>
                <p>
                  <strong>Tipo:</strong> {formData.tipo}
                </p>
                <p>
                  <strong>Data:</strong> {formData.data}
                </p>
                <p>
                  <strong>Código:</strong> {formData.codigo}
                </p>
                <p>
                  <strong>Nome:</strong> {formData.nome}
                </p>
                <p>
                  <strong>NUIT:</strong> {formData.nuit}
                </p>
                <p>
                  <strong>Entidade:</strong> {formData.entidade}
                </p>
                <p>
                  <strong>Descrição:</strong> {formData.descricao}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold">Produtos:</h3>
                {formData.produtos.map((produto, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2"
                  >
                    <span>{produto.nome}</span>
                    <span>
                      {produto.quantidade} x {produto.valor} ={" "}
                      {produto.total.toFixed(2)}
                    </span>
                  </div>
                ))}
                <h3 className="text-xl font-bold mt-2">
                  Total Geral: {calculateTotal()}
                </h3>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Submeter
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};