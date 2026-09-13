import { prisma } from "../lib/prisma";

async function main() {
  const email = "anothai.0978452316@gmail.com";
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (user) {
    await prisma.appOnboarding.deleteMany({
      where: { userId: user.id, appId: "kanban" }
    });
    console.log("Deleted kanban onboarding record for:", email);
  } else {
    console.log("User not found.");
  }
}

main().catch(console.error);
