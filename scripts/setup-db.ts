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

async function setupDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  console.log('Setting up database schema...');

  try {
    // Create submissions table to store user questionnaire submissions
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        is_practitioner BOOLEAN,
        stage VARCHAR(100),
        device_type VARCHAR(100),
        complexity VARCHAR(100),
        ip_status VARCHAR(100),
        time_commitment VARCHAR(100),
        budget_expectation VARCHAR(100),
        end_goal VARCHAR(100),
        biggest_concern VARCHAR(100),
        employer_type VARCHAR(100),
        coinventors VARCHAR(100),
        target_markets VARCHAR(100),
        device_description TEXT,
        is_qualified_lead BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Created submissions table');

    // Create plans table to store generated plans
    await sql`
      CREATE TABLE IF NOT EXISTS plans (
        id SERIAL PRIMARY KEY,
        submission_id INTEGER REFERENCES submissions(id),
        plan_json JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Created plans table');

    // Create index on email for faster lookups
    await sql`
      CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email)
    `;
    console.log('✓ Created email index');

    // Create index on created_at for reporting
    await sql`
      CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at)
    `;
    console.log('✓ Created created_at index');

    // Create analytics events table (Section 6.5 of spec)
    await sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255),
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Created analytics_events table');

    // Index on event_type for filtering
    await sql`
      CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events(event_type)
    `;
    console.log('✓ Created event_type index');

    // Index on session_id for funnel analysis
    await sql`
      CREATE INDEX IF NOT EXISTS idx_events_session ON analytics_events(session_id)
    `;
    console.log('✓ Created session_id index');

    // Add lead_score column to submissions (for CRM integration per Section 6.4)
    await sql`
      ALTER TABLE submissions
      ADD COLUMN IF NOT EXISTS lead_score INTEGER,
      ADD COLUMN IF NOT EXISTS lead_source VARCHAR(100) DEFAULT 'Idea Planner Tool',
      ADD COLUMN IF NOT EXISTS crm_tags TEXT[]
    `;
    console.log('✓ Added lead scoring columns to submissions');

    // Add description_expires_at for 90-day retention policy (Section 6.1)
    await sql`
      ALTER TABLE submissions
      ADD COLUMN IF NOT EXISTS description_expires_at TIMESTAMP
    `;
    console.log('✓ Added description expiry column');

    console.log('\n✅ Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
