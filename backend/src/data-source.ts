import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config as loadEnv } from 'dotenv';

loadEnv();

const isCompiled = __filename.endsWith('.js');
const ext = isCompiled ? 'js' : 'ts';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'kashidashi',
  password: process.env.DB_PASSWORD || 'kashidashi',
  database: process.env.DB_DATABASE || 'kashidashi',
  entities: [`${__dirname}/**/*.entity.${ext}`],
  migrations: [`${__dirname}/migrations/*.${ext}`],
  migrationsTableName: 'migrations',
});
