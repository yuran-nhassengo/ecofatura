// prisma/seed/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

async function main() {
  // Dados de exemplo para seeding

  const passwordHash = await bcrypt.hash('123456', 10);

  const user = await prisma.usuario.create({
    data: {
      nome: 'João Silva',
      apelido: 'João',
      dataNascimento:'02/02/1900',
      email: 'binario@example.com',
      senha: passwordHash, // A senha deve ser encriptada antes de inserir em produção
    },
  });

  console.log('Usuário criado:', user);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
