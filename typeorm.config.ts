import { DataSource, DataSourceOptions } from 'typeorm';

import 'dotenv/config';

const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  // host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.USER_NAME, // your username
  password: process.env.PASSWORD, // your password
  database: process.env.DB, // name of the database
  entities: ['dist/src/**/**/*.entity.{js,ts}'], // path to entities
  synchronize: false,
  logging: true,
  migrations: ['dist/src/migrations/*.{js,ts}'],
};

const dataSource = new DataSource(typeOrmConfig);
export default dataSource;
