import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local manually since this runs outside Next.js
function loadEnv() {
  const envPath = resolve(process.cwd(), '.env.local');
  try {
    const envFile = readFileSync(envPath, 'utf-8');
    for (const line of envFile.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        if (key && value) {
          process.env[key] = value;
        }
      }
    }
  } catch {
    // Try .env as fallback
    try {
      const envFile = readFileSync(resolve(process.cwd(), '.env'), 'utf-8');
      for (const line of envFile.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          const value = valueParts.join('=');
          if (key && value) {
            process.env[key] = value;
          }
        }
      }
    } catch {
      // No env file found
    }
  }
}

loadEnv();

async function migrateEmailNullable() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  console.log('Making email column nullable...');

  try {
    // Make email nullable (remove NOT NULL constraint)
    await sql`
      ALTER TABLE submissions
      ALTER COLUMN email DROP NOT NULL
    `;
    console.log('✓ Email column is now nullable');

    // Also make name nullable since we removed the email-gate
    await sql`
      ALTER TABLE submissions
      ALTER COLUMN name DROP NOT NULL
    `;
    console.log('✓ Name column is now nullable');

    console.log('\n✅ Migration complete!');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

migrateEmailNullable();
