
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, GoneException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServerData } from 'src/response/response';
import { JWT } from 'src/utils/crypto';

//处理Token过期或者无效
@Injectable()
export class TokenExpireInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest() as Request;
    const res = context.switchToHttp().getResponse() as Response;
    const Token = req.headers.authorization;
    const [ error, verify ] = JWT.verify(Token);
    if(error) {
      // 需要Token认证的接口添加拦截器
      // 返回410 数据有效，token需要刷新
      // 返回409 数据无效, token无效
      if(error === "TokenExpiredError: jwt expired") {
        res.status(HttpStatus.GONE);
        return next.handle().pipe(map( (data: ServerData<any>) => {
          data.code = HttpStatus.GONE;
          data.message = error;
          return data;
        }));
      }
      else {
        res.status(HttpStatus.CONFLICT);
        return next.handle().pipe(map( (data: ServerData<any>) => {
          data.data = error;
          data.code = HttpStatus.CONFLICT;
          data.message = error;
          return data;
        }));
      }
    }
    return next
      .handle()
  }
}