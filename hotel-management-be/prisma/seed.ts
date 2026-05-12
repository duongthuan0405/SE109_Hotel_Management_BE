import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    // 1. Seed Accounts
    const passwordHash = await bcrypt.hash('111222', 10);
    const roles = [
      { role: 'Admin', username: 'admin1', fullName: 'Admin 1 Name', code: 'NV00001' },
      { role: 'Manager', username: 'manager1', fullName: 'Manager 1 Name', code: 'NV00002' },
      { role: 'Receptionist', username: 'receptionist1', fullName: 'Receptionist 1 Name', code: 'NV00003' },
      { role: 'Customer', username: 'customer1', fullName: 'Customer 1 Name', code: 'KH00001' },
    ];

    for (const item of roles) {
      const existing = await prisma.user.findUnique({ where: { username: item.username } });
      if (existing) continue;

      if (item.role === 'Customer') {
        await prisma.user.create({
          data: {
            username: item.username, passwordHash, role: 'Customer',
            customer: { create: { code: item.code, fullName: item.fullName, identityCard: `ID${Date.now()}${Math.random()}`, phone: '0987654321' } }
          }
        });
      } else {
        await prisma.user.create({
          data: {
            username: item.username, passwordHash, role: item.role as any,
            staff: { create: { code: item.code, fullName: item.fullName, position: item.role, phone: '0123456789', email: `${item.username}@hotel.com` } }
          }
        });
      }
    }
    console.log('Accounts seeded.');

    // 2. Seed RoomTypes & Rooms
    const roomTypeData = [
      { code: 'LP00001', name: 'VIP Room', price: 10000, maxOccupancy: 2 },
      { code: 'LP00002', name: 'Normal Room', price: 3000, maxOccupancy: 2 },
      { code: 'LP00003', name: 'Budget Room', price: 5000, maxOccupancy: 1 },
    ];

    let roomCount = 1;
    for (const rt of roomTypeData) {
      const roomType = await prisma.roomType.upsert({
        where: { code: rt.code },
        update: { price: rt.price, name: rt.name },
        create: { code: rt.code, name: rt.name, price: rt.price, maxOccupancy: rt.maxOccupancy },
      });

      // Seed 5 rooms for each type
      for (let i = 1; i <= 5; i++) {
        const roomCode = `P${roomCount.toString().padStart(5, '0')}`;
        await prisma.room.upsert({
          where: { code: roomCode },
          update: { price: rt.price, roomTypeId: roomType.id },
          create: {
            code: roomCode,
            roomTypeId: roomType.id,
            price: rt.price,
            status: 'Available'
          }
        });
        roomCount++;
      }
      console.log(`Upserted RoomType ${rt.code} and 5 rooms.`);
    }
    console.log('RoomTypes and Rooms seeded.');

    // 3. Seed Services
    const services = [
      { code: 'DV00001', name: 'Laundry Service', price: 50 },
      { code: 'DV00002', name: 'Breakfast Buffet', price: 200 },
      { code: 'DV00003', name: 'Airport Pickup', price: 500 },
      { code: 'DV00004', name: 'Spa & Massage', price: 800 },
      { code: 'DV00005', name: 'Mini Bar Service', price: 150 },
    ];

    for (const service of services) {
      await prisma.service.upsert({
        where: { code: service.code },
        update: { name: service.name, price: service.price },
        create: { code: service.code, name: service.name, price: service.price },
      });
    }
    console.log('Services seeded.');

    // 4. Seed Payment Methods
    const paymentMethods = [
      { code: 'PM00001', name: 'Momo Wallet' },
      { code: 'PM00002', name: 'Cash' },
    ];

    for (const pm of paymentMethods) {
      await prisma.paymentMethod.upsert({
        where: { code: pm.code },
        update: { name: pm.name },
        create: { code: pm.code, name: pm.name },
      });
    }
    console.log('Payment Methods seeded.');

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
