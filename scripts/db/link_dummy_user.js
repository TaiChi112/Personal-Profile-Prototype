const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
      }
    });
  }
  
  await prisma.user.update({
    where: { id: user.id },
    data: { lineUserId: "U1234567890" }
  });
  
  console.log("Dummy user linked with lineUserId U1234567890");
}
main();
