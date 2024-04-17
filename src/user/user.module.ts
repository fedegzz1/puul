import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { Task } from '../task/entities/Task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}