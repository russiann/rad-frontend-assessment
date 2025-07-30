import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Para desenvolvimento local, usamos um arquivo SQLite
// Em produção, usamos Turso (SQLite na nuvem)
let client;

try {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('libsql://')) {
    // Produção com Turso
    client = createClient({
      url: process.env.DATABASE_URL,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  } else {
    // Desenvolvimento local
    client = createClient({
      url: process.env.DATABASE_URL || 'file:./dev.db',
    });
  }
} catch (error) {
  console.warn('Database connection failed, using fallback configuration');
  // Fallback para desenvolvimento sem arquivo de DB
  client = createClient({
    url: ':memory:',
  });
}

export const db = drizzle(client, { schema }); 