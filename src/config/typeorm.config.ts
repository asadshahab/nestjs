import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres', // your username
  password: 'kwanso', // your password
  database: 'onlinestore', // name of the database
  entities: [__dirname + '/../**/*.entity.{js,ts}'], // path to entities
  synchronize: true, // synchronize database schema with entities

  // migrationsTableName: 'migration',
};
