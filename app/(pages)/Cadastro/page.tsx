'use client';

import { Header } from '@/components/(Header)/header';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

const formSchema = z.object({
  nome: z.string().nonempty('Nome é obrigatório.'),
  apelido: z.string().nonempty('Apelido é obrigatório.'),
  email: z.string().email('E-mail inválido.').nonempty('E-mail é obrigatório.'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.'),
  confirmarSenha: z.string().min(6, 'Confirmação de senha deve ter pelo menos 6 caracteres.'),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem.',
  path: ['confirmarSenha'],
});

type FormData = z.infer<typeof formSchema>;

const FormCadastro = () => {
  const steps = [
    { label: 'Informações Pessoais', fields: ['nome', 'apelido'] },
    { label: 'Credenciais', fields: ['email', 'senha', 'confirmarSenha'] },
    { label: 'Resumo', fields: [] },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      apelido: '',
      email: '',
      senha: '',
      confirmarSenha: '',
    },
  });

  const nextStep = async () => {
    const result = await handleSubmit(() => { })(); // Validação sem submissão
    if (Object.keys(errors).length === 0) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const onSubmit = async (data: FormData) => {
    setLoading(true); // Começa o carregamento
    setErrorMessage(''); // Limpa mensagens de erro

    try {
      // Enviar dados para o servidor usando axios
      const response = await axios.post('/api/usuarios', data);

      // Verifica se a resposta foi bem-sucedida
      if (response.status === 201) {
        // Caso o cadastro seja bem-sucedido, redirecionar ou mostrar mensagem
        alert('Cadastro realizado com sucesso!');
        // Você pode redirecionar o usuário para a página de login ou outro local:
        // window.location.href = '/login';
      } else {
        setErrorMessage('Erro ao cadastrar usuário');
        
      }
    } catch (error: any) {
      // Se houver erro, captura e exibe a mensagem de erro
      setErrorMessage(error.response?.data?.message || 'Erro inesperado');
      console.log("erro ao cadastara......",error);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  const handleProgressClick = (stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <div>
      <Header />
      <div className="flex w-full min-h-screen">
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(https://laisschulz.com/wp-content/uploads/2024/01/poses-para-fotos-femininas-image-24.jpg)' }}></div>

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-center mb-6">Cadastro de Usuário</h2>

          <div className="relative mb-6">
            <div className="grid text-center items-center sm:flex sm:justify-between justify-center px-4 mb-2">
              {steps.map((step, index) => (
                <span
                  key={index}
                  className={`text-sm lg:text-base font-bold cursor-pointer ${currentStep === index ? 'text-green-500' : 'text-gray-500'
                    } transition-colors duration-300`}
                  onClick={() => handleProgressClick(index)}
                >
                  {step.label}
                </span>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <h3 className="text-lg md:text-xl font-medium mb-4">{steps[currentStep].label}</h3>

            {steps[currentStep].fields.map((field) => (
              <div key={field} className="mb-4">
                <label htmlFor={field} className="block text-sm font-medium mb-2">
                  {field === 'confirmarSenha' ? 'Confirmar Senha' : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <Controller
                  control={control}
                  name={field as keyof FormData}
                  render={({ field: inputProps }) => (
                    <input
                      {...inputProps}
                      id={field}
                      type={field === 'senha' || field === 'confirmarSenha' ? 'password' : 'text'} // Corrigido para ocultar senha
                      className={`w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${errors[field as keyof FormData] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'
                        }`}
                      placeholder={`Digite seu ${field === 'confirmarSenha' ? 'confirmar senha' : field}`}
                    />
                  )}
                />

                {errors[field as keyof FormData] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field as keyof FormData]?.message}
                  </p>
                )}
              </div>
            ))}

            {currentStep === steps.length - 1 && (
              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-2">Resumo do Cadastro</h4>
                <p><strong>Nome:</strong> {watch('nome')}</p>
                <p><strong>Apelido:</strong> {watch('apelido')}</p>
                <p><strong>E-mail:</strong> {watch('email')}</p>
              </div>
            )}

            <div className="flex justify-between mt-6">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 text-white bg-gray-400 rounded-lg hover:bg-gray-500"
                >
                  Voltar
                </button>
              )}
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  Cadastrar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormCadastro;
