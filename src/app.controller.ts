import {
  CacheInterceptor,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import { of, tap, from } from 'rxjs';

import { AppService } from './app.service';

import type { Cache } from 'cache-manager';

function isNil(value: unknown): value is undefined | null {
  return value === null || value === undefined;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // This will crush app
  @UseInterceptors(CacheInterceptor)
  @Get()
  getUndefinedUnhandledPromiseError() {
    return undefined;
  }

  // Solution suggestion 1
  // use async function and handle with try catch
  @Get('solution')
  getSolution1() {
    return of('default').pipe(
      tap(async () => {
        try {
          await this.cacheManager.set('noname', undefined);
        } catch (err) {
          // Error won't get handled by filter exceptions
          console.error(err);
        }
      }),
    );
  }

  // Solution suggestion 2
  // Only save if value is not Nil
  @Get('solution2')
  getSolution12() {
    return from([undefined, 'default']).pipe(
      tap((value) => {
        // save only if value is not nil
        if (!isNil(value)) {
          this.cacheManager.set('noname', value);
        }
      }),
    );
  }

  // Dummy route
  @Get('hello')
  getHello() {
    console.log('hello');
    return of(this.appService.getHello());
  }
}
