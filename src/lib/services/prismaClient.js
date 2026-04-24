import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

const pool = new pg.Pool({
    connectionString,
    keepAlive: true,
    ssl: {
        rejectUnauthorized: false,
    },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
