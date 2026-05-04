import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set');
    return;
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const username = 'admin1';
    const password = '111222';
    const fullName = 'Admin 1';
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      console.log(`User ${username} already exists.`);
      return;
    }

    // Create User and Staff
    const newUser = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role: 'Admin',
        staff: {
          create: {
            code: 'ADMIN001',
            fullName,
            position: 'Administrator',
            phone: '0000000000',
            email: 'admin1@hotel.com'
          }
        }
      }
    });

    console.log(`Admin account created: ${username} / ${password}`);
  } catch (error) {
    console.error('Error creating admin account:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
