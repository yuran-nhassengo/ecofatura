'use client';

import { Header } from '@/components/(Header)/header';
import { useState } from 'react';

const FormLogin = () => {
  const steps = [
    { label: 'Credenciais', fields: ['E-mail', 'Senha'] },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

 
  

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulário de login enviado:', formData);
  };

  const handleProgressClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div>
      <Header />
      <div className="flex w-full min-h-screen">
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(https://laisschulz.com/wp-content/uploads/2024/01/poses-para-fotos-femininas-image-24.jpg)' }}></div>

        {/* Formulário à direita */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-center mb-12">Login</h2>

          <div className="relative mb-6">
            <div className="w-full grid text-center items-center sm:flex  justify-center px-4 mb-2">
              {steps.map((step, index) => (
                <span
                  key={index}
                  className={`text-sm lg:text-base font-bold cursor-pointer ${
                    currentStep === index ? 'text-green-500' : 'text-gray-500'
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

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="mt-4 md:mt-0">
            <h3 className="text-lg md:text-xl font-medium mb-4">{steps[currentStep].label}</h3>

            {steps[currentStep].fields.length > 0 &&
              steps[currentStep].fields.map((field, index) => (
                <div key={index} className="mb-4">
                  <label htmlFor={field} className="block text-sm font-medium mb-2">
                    {field}
                  </label>
                  <input
                    type={field === 'Senha' ? 'password' : 'email'}
                    id={field}
                    name={field.toLowerCase()} 
                    value={formData[field.toLowerCase() as keyof typeof formData] || ''} 
                    onChange={handleChange}
                    className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={`Digite seu ${field}`}
                    required
                  />
                </div>
              ))}

          

            {/* Botões de navegação */}
            <div className="flex justify-between mt-6">
              
            
              
             
              
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  Entrar
                </button>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormLogin;
