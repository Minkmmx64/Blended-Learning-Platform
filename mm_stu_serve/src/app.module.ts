import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './Modules/common/common.module';
import { RootModule } from './Modules/root/root.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StuCollegeModule } from './Modules/college/college.module';
import { MenuModule } from './Modules/menu/menu.module';
import { RoleModule } from './Modules/role/role.module';
import { ClassModule } from './Modules/class/class.module';
import { StuModule } from './Modules/stu/stu.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "root",
      "password": "123456",
      "database": "mm_stu",
      "entities": ["./src/**/*.entity{.ts,.js}"],
      "synchronize": true
    }),
    RootModule,
    CommonModule,
    StuCollegeModule,
    MenuModule,
    RoleModule,
    ClassModule,
    StuModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    
  }
}
