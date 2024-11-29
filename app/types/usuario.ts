// Definindo a interface do modelo Usuario
export interface Usuario {
    id: string;             // Correspondente ao tipo String @id @default(cuid())
    nome: string;           // Correspondente ao tipo String
    email: string;          // Correspondente ao tipo String
    dataNascimento: string; // Correspondente ao tipo String
    senha: string;          // Correspondente ao tipo String
  }
  