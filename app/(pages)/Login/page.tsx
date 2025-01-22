'use client';

import { Header } from '@/components/(Header)/header';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import axios from 'axios';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido.').nonempty('E-mail é obrigatório.'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const FormLogin = () => {
  const [currentStep, setCurrentStep] = useState(0); 
  const totalSteps = 1; 

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('Login efetuado com:', data);

    try {
      // Usando o axios para enviar os dados para a API de login
      const response = await axios.post('/api/login', data);

      if (response.status === 200) {
        // Se o login for bem-sucedido, simula a atualização da barra de progresso
        setCurrentStep(totalSteps - 1); 
        console.log('Usuário autenticado:', response.data);
        // Pode redirecionar para o painel ou para outra página
        // window.location.href = '/dashboard'; // Exemplo de redirecionamento
      } else {
        console.log('Credenciais inválidas');
      }
    } catch (error) {
      // Se a requisição falhar
      console.log('Erro ao conectar ao servidor. Tente novamente.');
    }
  };

  return (
    <div>
      <Header />
      <div className="flex w-full min-h-screen">
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(https://laisschulz.com/wp-content/uploads/2024/01/poses-para-fotos-femininas-image-24.jpg)' }}></div>

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

          {/* Texto "Credenciais" em cima da barra de progresso */}
          <div className="`flex text-sm lg:text-base font-bold cursor-pointer text-green-500 transition-colors duration-300 text-center justify-center `">Credenciais</div>

          <div className="relative mb-6 mt-2">
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full transition-width duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                E-mail
              </label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <input
                    {...field}
                    id="email"
                    type="email"
                    className={`w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'
                    }`}
                    placeholder="Digite seu e-mail"
                  />
                )}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="senha" className="block text-sm font-medium mb-2">
                Senha
              </label>
              <Controller
                control={control}
                name="senha"
                render={({ field }) => (
                  <input
                    {...field}
                    id="senha"
                    type="password"
                    className={`w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.senha ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'
                    }`}
                    placeholder="Digite sua senha"
                  />
                )}
              />
              {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormLogin;
