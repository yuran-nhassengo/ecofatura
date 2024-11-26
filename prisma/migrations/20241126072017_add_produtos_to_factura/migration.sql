-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valor" REAL NOT NULL,
    "total" REAL NOT NULL,
    "facturaId" TEXT NOT NULL,
    CONSTRAINT "Produto_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
