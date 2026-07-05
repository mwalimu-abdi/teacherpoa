require("dotenv/config")
const bcrypt = require("bcryptjs")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

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