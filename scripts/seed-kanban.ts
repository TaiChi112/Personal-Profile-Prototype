import prisma from '../lib/prisma';

async function main() {
  const email = "anothai.0978452316@gmail.com";
  
  console.log(`Looking for user with email: ${email}`);
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log(`User with email ${email} not found. Exiting gracefully.`);
    return;
  }

  console.log(`User found. Creating Kanban tasks...`);

  await prisma.kanbanTask.create({
    data: {
      title: "🚀 ลองเล่น Kanban ผ่าน MCP (AI Terminal)",
      status: "todo",
      userId: user.id,
    },
  });

  await prisma.kanbanTask.create({
    data: {
      title: "🧠 คิดสถาปัตยกรรม AI-Native OS ต่อ",
      status: "in-progress",
      userId: user.id,
    },
  });

  await prisma.kanbanTask.create({
    data: {
      title: "✅ ทดสอบระบบฐานข้อมูล",
      status: "done",
      userId: user.id,
    },
  });

  console.log("Kanban tasks seeded successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding Kanban tasks:", e);
    process.exit(1);
  });
