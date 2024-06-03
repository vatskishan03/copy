// backend/src/config/env.ts
import { cleanEnv, str, port } from 'envalid';
import * as path from 'path';
import * as dotenv from 'dotenv';

const envPath = path.join(__dirname, '../.env'); 
dotenv.config({ path: envPath });

const env = cleanEnv(process.env, {
  DATABASE_URL: str(), 
  PORT: port({ default: 3000 }),
  NODE_ENV: str({ choices: ['development', 'test', 'production'], devDefault: 'development' }),
});

export default env;
