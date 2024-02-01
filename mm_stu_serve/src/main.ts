import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as path from "path";
import { netWorkInterface } from "./utils/os";

async function bootstrap() {
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: [
      "http://localhost:3000"
    ],
    credentials: true,
  });
  //请求前缀
  app.setGlobalPrefix("api");
  //使用cookie - session
  app.use(cookieParser());
  app.use(
    session({
      secret: "mjw",
      rolling: true,
      cookie: {
        maxAge: 60000,
      },
      saveUninitialized: true,
      resave: true,
    }),
  );

  //静态图片资源
  app.useStaticAssets(path.join(__dirname,"static", "image"), {
    prefix: "/image"
  });

  //静态文件资源
  app.useStaticAssets(path.join(__dirname,"static", "file"), {
    prefix: "/file"
  });
  
  console.log(netWorkInterface);
  
  await app.listen(8080);
}

bootstrap();
