import { Options } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: Options = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  type: 'postgresql',
  host: process.env.DATABASE_HOST,
  dbName: process.env['DATABASE_NAME'],
  port: +process.env['DATABASE_PORT'],
  user: process.env['DATABASE_USERNAME'],
  password: process.env['DATABASE_PASSWORD'],
  allowGlobalContext: true,
  metadataProvider: TsMorphMetadataProvider,
  debug: process.env['NODE_ENV'] === 'production' ? false : true,
  schemaGenerator: {
    disableForeignKeys: false, // try to disable foreign_key_checks (or equivalent) // prevents error permission denied to set parameter "session_replication_role"
    createForeignKeyConstraints: true, // do not generate FK constraints
  },
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    disableForeignKeys: false,
  },
};

export default config;
