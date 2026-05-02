import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import env from './env.js'
import { PrismaClient } from '@prisma/client'

const connectionString = env.DATABASE_URL;

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (env.NODE_ENV== 'production') globalThis.prisma = prisma
