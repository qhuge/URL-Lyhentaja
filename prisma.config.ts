import { config } from 'dotenv';
import path from 'path';

// use .env.local instead of .env
config({ path: path.join(process.cwd(), '.env.local') });

import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'), // get the database url from env file
  },
});