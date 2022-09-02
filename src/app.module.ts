import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';

import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    CacheModule.register({
      ttl: 2,
      store: redisStore,
      // host: "localhost",
      // port: 6379,
      url: 'redis://redis:6379/0',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
