import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Clean up existing data
    await prisma.snippet.deleteMany({});

    // Add test snippet
    const testSnippet = await prisma.snippet.create({
      data: {
        token: 'TEST1',
        content: 'This is a test snippet.',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        lastAccessed: new Date(),
        viewCount: 0
      },
    });

    console.log('Seeded test snippet:', testSnippet);
  } catch (error) {
    console.error('Error in seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });