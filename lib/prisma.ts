import "dotenv/config"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "@prisma/client"

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db"

const adapter = new PrismaBetterSqlite3({
  url: databaseUrl,
})

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}

export default prisma