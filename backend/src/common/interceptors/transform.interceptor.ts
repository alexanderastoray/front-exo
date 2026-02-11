import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  meta?: any;
}

/**
 * Transform interceptor to standardize API responses
 * Wraps all responses in { data, meta? } format
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data already has data and meta properties, return as is
        if (data && typeof data === 'object' && 'data' in data) {
          return data;
        }
        // Otherwise, wrap in data property
        return { data };
      }),
    );
  }
}
