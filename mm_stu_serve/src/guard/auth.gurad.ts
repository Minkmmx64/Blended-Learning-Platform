import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from "express";
import { JWT } from 'src/utils/crypto';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const authorization = request.headers.authorization.replace("Bearer ", "");
    const [ error, verify ] = JWT.verify(authorization);
    if(error) {
      if(error === "TokenExpiredError: jwt expired") {
        return true;
      }
      return false;
    }
    return true;
  }
}