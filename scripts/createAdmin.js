require("dotenv/config")
const bcrypt = require("bcryptjs")
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3")
const { PrismaClient } = require("@prisma/client")

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db"
const adapter = new PrismaBetterSqlite3({
  url: databaseUrl,
})

const prisma = new PrismaClient({ adapter })

async function createAdmin() {
  try {
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: "admin@mwalimuhodari.com" },
    })

    if (existingAdmin) {
      console.log("Admin already exists")
      return
    }

    const password = await bcrypt.hash("admin123", 10)

    await prisma.admin.create({
      data: {
        name: "System Admin",
        email: "admin@mwalimuhodari.com",
        password,
      },
    })

    console.log("Admin created successfully")
  } catch (error) {
    console.error("Error creating admin:", error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()