import prisma from "../lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  const email = "admin@mwalimuhodari.com"
  const plainPassword = "Admin@12345" // 🔑 change anytime you want

  const hashedPassword = await bcrypt.hash(plainPassword, 10)

  await prisma.admin.upsert({
    where: { email },
    update: {
      name: "Main Admin",
      password: hashedPassword,
    },
    create: {
      name: "Main Admin",
      email,
      password: hashedPassword,
    },
  })

  console.log("✅ Admin ready!")
  console.log("👉 Login with:")
  console.log("Email:", email)
  console.log("Password:", plainPassword)
}

main()
  .catch((error) => {
    console.error("❌ CREATE ADMIN ERROR:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })