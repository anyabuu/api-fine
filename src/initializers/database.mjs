import * as pg from 'pg';

const { Client } = pg.default;

export const client = new Client({
  database: 'fine',
  user: 'postgres',
  password: 'postgres',
  port: 5556,
  host: 'localhost',
});
