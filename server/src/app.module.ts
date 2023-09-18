import { TatetiModule } from './tateti/tateti.module';
import { RedisModule } from './redis/redis.module';
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import * as Joi from 'joi';
import config from './config/config';
import { MikroORMOptions } from '@mikro-orm/core';

@Module({
  imports: [
    RedisModule,
    TatetiModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
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
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        entities: ['./dist/**/*.entity.js'],
        entitiesTs: ['./src/**/*.entity.ts'],
        type: 'postgresql',
        host: configService.get<string>('DATABASE_HOST'),
        dbName: configService.get<string>('DATABASE_NAME'),
        port: configService.get<number>('DATABASE_PORT'),
        user: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        allowGlobalContext: true,
        metadataProvider: TsMorphMetadataProvider,
        debug: true,
        migrations: {
          path: 'dist/migrations',
          pathTs: 'src/migrations',
        },
      }),
    }),
  ],
})
export class AppModule {}
