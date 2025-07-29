import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Para desenvolvimento local, usamos um arquivo SQLite
// Em produção, você poderia usar Turso ou outro serviço
const client = createClient({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

export const db = drizzle(client, { schema }); 