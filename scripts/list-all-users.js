const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`\n📊 Total users in database: ${users.length}\n`);
    console.log('='.repeat(80));
    
    if (users.length === 0) {
      console.log('⚠️  No users found in database!\n');
      console.log('   Users need to register first at /auth/register\n');
      return;
    }

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User:`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name || '(not set)'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Email Verified: ${user.emailVerified ? '✅ Yes' : '❌ No'}`);
      const passwordStatus = user.password 
        ? `✅ Stored (${user.password.substring(0, 30)}...)` 
        : '❌ MISSING - USER CANNOT LOG IN';
      console.log(`   Password: ${passwordStatus}`);
      console.log(`   Created: ${user.createdAt.toLocaleString()}`);
    });

    console.log('\n' + '='.repeat(80) + '\n');
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listAllUsers();
