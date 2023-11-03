import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { JWT } from "src/utils/crypto";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean>{
    const request = context.switchToHttp().getRequest() as Request;
    const Token = request.headers.authorization ?? "";
    try {
      JWT.verify(Token);
      return true;
    } catch (error) {
      const message = new Error(error).message;
      if(message === "TokenExpiredError: jwt expired") return true;
      return false;
    }
  }
}