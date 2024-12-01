import { useRouter } from 'next/router';

export const BotaoVoltar = () => {
  const router = useRouter();

  const voltar = () => {
    router.back();
  };

  return (
    <button onClick={voltar}>
      Voltar
    </button>
  );
};

