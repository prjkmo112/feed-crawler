import * as DBMainPrisma from 'prisma/main-mysql/generated';


const dbMain = new DBMainPrisma.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty'
});

export { dbMain, DBMainPrisma };