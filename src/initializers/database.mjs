import * as dotenv from 'dotenv';
dotenv.config();
import * as pg from 'pg';

const { Client } = pg.default;

import tls from 'node:tls';
export const client = new Client({


  connectionString:
    process.env.PSQL_CONNECTION ||
    'postgresql://myuser:mypassword@localhost:5432/postgres',

  database: 'postgres',
  user: 'postgres',
  password: 'postgres',
  port: 5556,
  host: 'localhost',


});
