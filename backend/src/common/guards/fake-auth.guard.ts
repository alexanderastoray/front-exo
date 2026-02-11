import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Fake authentication guard for V1
 * Always returns true to allow all requests
 * V2: Will be replaced with JWT authentication
 */
@Injectable()
export class FakeAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // V1: Always allow
    return true;

    // V2: Will validate JWT token
    // const request = context.switchToHttp().getRequest();
    // const token = request.headers.authorization?.split(' ')[1];
    // return this.jwtService.verify(token);
  }
}
