import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as path from "path";

async function bootstrap() {
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://minkmm.top",
      "http://124.220.176.205:3000"
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

  //静态资源
  app.useStaticAssets(path.join(__dirname,"static", "image"), {
    prefix: "/image"
  })
  
  await app.listen(8080);
}

bootstrap();
