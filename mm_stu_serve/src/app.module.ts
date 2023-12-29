import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RootModule } from './Modules/admin/root/root.module';
import { CommonModule } from './Modules/admin/common/common.module';
import { StuCollegeModule } from './Modules/admin/college/college.module';
import { MenuModule } from './Modules/admin/menu/menu.module';
import { RoleModule } from './Modules/admin/role/role.module';
import { ClassModule } from './Modules/admin/class/class.module';
import { StuModule } from './Modules/admin/stu/stu.module';
import { TeacherModule } from './Modules/admin/teacher/teacher.module';
import { CourseModule } from './Modules/admin/course/course.module';
import { ChapterModule } from './Modules/admin/chapter/chapter.module';
import * as dotenv from "dotenv";
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "mysql",
      "host": process.env.MYSQL_HOST,
      "port": parseInt(process.env.MYSQL_PORT),
      "username": process.env.MYSQL_NAME,
      "password": process.env.MYSQL_PASSWORD,
      "database": process.env.MYSQL_DATABASE_1,
      "entities": ["./src/**/*.entity{.ts,.js}"],
      "synchronize": true
    }),
    RootModule,
    CommonModule,
    StuCollegeModule,
    MenuModule,
    RoleModule,
    ClassModule,
    StuModule,
    TeacherModule,
    CourseModule,
    ChapterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    
  }
}
