const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        emailVerified: true,
        createdAt: true,
      }
    });

    if (!user) {
      console.log(`❌ User with email "${email}" not found in database.`);
      return;
    }

    console.log('\n✅ User found in database:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${user.name || '(not set)'}`);
    console.log(`Role: ${user.role}`);
    console.log(`Email Verified: ${user.emailVerified ? 'Yes ✅' : 'No ❌'}`);
    console.log(`Created: ${user.createdAt}`);
    console.log(`Password Hash: ${user.password ? `✅ Stored (${user.password.substring(0, 20)}...)` : '❌ NOT STORED'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (!user.password) {
      console.log('⚠️  WARNING: User has no password stored!');
      console.log('   This user cannot log in. They may need to reset their password.\n');
    }

    if (!user.emailVerified) {
      console.log('⚠️  NOTE: User email is not verified.');
      console.log('   (This should not prevent login, but check auth logic)\n');
    }
  } catch (error) {
    console.error('Error checking user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node scripts/check-user.js <email>');
  console.log('Example: node scripts/check-user.js user@example.com');
  process.exit(1);
}

checkUser(email);


