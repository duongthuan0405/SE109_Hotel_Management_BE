import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import env from './env.js'
import { PrismaClient } from '@prisma/client'
import { getTransactionClient } from './transaction-context.js'

const connectionString = env.DATABASE_URL;

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const originalPrisma = globalThis.prisma ?? prismaClientSingleton()

/**
 * Tạo một Proxy cho Prisma Client.
 * Proxy này sẽ kiểm tra xem có Transaction Client nào đang hoạt động trong AsyncLocalStorage không.
 * Nếu có, nó sẽ sử dụng Transaction Client đó. Nếu không, nó dùng Client gốc.
 */
const prismaProxy = new Proxy(originalPrisma, {
  get(target, prop, receiver) {
    // Lấy transaction client từ context
    const txClient = getTransactionClient();
    
    // Nếu có transaction client, ta ưu tiên sử dụng nó
    // Ngoại trừ các thuộc tính/phương thức bắt đầu bằng '$' (như $connect, $transaction...) 
    // thường nên chạy trên client gốc.
    if (txClient && typeof prop === 'string' && !prop.startsWith('$')) {
      return Reflect.get(txClient, prop, txClient);
    }
    
    return Reflect.get(target, prop, receiver);
  }
});

export default prismaProxy as typeof originalPrisma;

if (env.NODE_ENV === 'production') globalThis.prisma = originalPrisma;

