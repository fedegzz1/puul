import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Task } from '../task/entities/task.entity';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user: User = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.role = createUserDto.role;
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(name: string): Promise<User> {
    return this.userRepository.findOneBy({name});
  }

  async findTasks(name: string): Promise<number>{

    const taskCount  = await this.userRepository.createQueryBuilder('user')
        .leftJoin('user.tasks', 'task') // join with the Task entity
        .select('COUNT(task.name) as taskCount') // select and count tasks
        .where('user.name = :name', { name }) // filter by user ID
        .andWhere('task.status = :status', { status: 'finished' }) // filter by task status
        .getRawOne();

    return taskCount;
  }

  async findCost(name: string): Promise<number> {
    const taskCostSum  = await this.userRepository.createQueryBuilder('user')
        .leftJoin('user.tasks', 'task') // join with the Task entity
        .select('SUM(task.cost) as taskCostSum') // select and sum task costs
        .where('user.name = :name', { name }) // filter by user ID
        .andWhere('task.status = :status', { status: 'finished' }) // filter by task status
        .getRawOne();

    return taskCostSum;
}

 /*  updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = new User();
    user.name = updateUserDto.name;
    user.age = updateUserDto.age;
    user.email = updateUserDto.email;
    user.role = updateUserDto.role;
    user.id = id;
    return this.userRepository.save(user);
  } */

  remove(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }
}
