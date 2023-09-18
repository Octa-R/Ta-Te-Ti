import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    APP_PORT: process.env.APP_PORT,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_HOST: process.env.REDIS_HOST,
  };
});
