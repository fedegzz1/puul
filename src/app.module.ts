import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/User.entity';
import { TaskModule } from './task/task.module';
import { Task } from './task/entities/Task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'password',
      username: 'postgres',
      entities: [User,Task],
      database: 'pool2',
      synchronize: true,
      logging: true,
    }),
    UserModule,
    TaskModule,
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}