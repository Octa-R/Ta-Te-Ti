import { TatetiModule } from './tateti/tateti.module';
import { RedisModule } from './redis/redis.module';
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import config from './config/config';
@Module({
  imports: [
    RedisModule,
    TatetiModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        APP_PORT: Joi.number().required(),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        DATABASE_PORT: Joi.number(),
        DATABASE_HOST: Joi.string(),
        DATABASE_USERNAME: Joi.string(),
        DATABASE_PASSWORD: Joi.string(),
        DATABASE_NAME: Joi.string(),
        REDIS_PORT: Joi.string(),
        REDIS_HOST: Joi.string(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    MikroOrmModule.forRoot({}),
  ],
})
export class AppModule {}
