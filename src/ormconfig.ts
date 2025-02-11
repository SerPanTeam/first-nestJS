import { TypeOrmModuleOptions } from './../node_modules/@nestjs/typeorm/dist/interfaces/typeorm-options.interface.d';
// import { PostgresConnectionOptions } from './../node_modules/typeorm/browser/driver/postgres/PostgresConnectionOptions.d';
//import { TypeOrmModuleOptions } from 'typeorm';
//imort TypeOrmModuleOptions

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '36355693801',
  database: 'postgres',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  // cli: {},
};

export default config;
