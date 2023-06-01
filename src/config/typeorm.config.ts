import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.USER_NAME, // your username
  password: process.env.PASSWORD, // your password
  database: process.env.DB, // name of the database
  entities: [__dirname + '/../**/*.entity.{js,ts}'], // path to entities
  synchronize: true, // synchronize database schema with entities

  // migrationsTableName: 'migration',
};
