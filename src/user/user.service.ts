import { Injectable , NotFoundException, BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Task } from '../task/entities/task.entity';
import { FindUserDto } from './dto/find-user.dto';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const name = createUserDto.name
    const findUser = await this.userRepository.findOne({where: {name}});
    if (findUser){
      throw new BadRequestException('Username already exists');
    }

    const user: User = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.role = createUserDto.role;
    return this.userRepository.save(user);
  }

  /* async update(name: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { name } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user properties with the provided data
    Object.assign(user, updateUserDto);

    return this.userRepository.save(user); // Save the updated user
  } */

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(name: string): Promise<User> {
    return this.userRepository.findOneBy({name});
  }

  /* async findTasks(name: string): Promise<number>{

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
} */

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


  async findByRequest(findUserDto: FindUserDto): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .where('1 = 1'); // Ensures that subsequent conditions are connected with 'AND' correctly
  
    if (findUserDto.name != null) {
      queryBuilder.andWhere('user.name = :name', { name: findUserDto.name });
    }
  
    if (findUserDto.email != null) {
      queryBuilder.andWhere('user.email = :email', { email: findUserDto.email });
    }
  
    if (findUserDto.role != null) {
      queryBuilder.andWhere('user.role = :role', { role: findUserDto.role });
    }
  
    queryBuilder
      .leftJoin('user.tasks', 'tasks')
      .andWhere('(tasks.status = :status OR tasks.status IS NULL)', { status: 'finished' }) // Filtering tasks
  
      .select('user.name', 'user_name')
      .addSelect('user.email', 'user_email')
      .addSelect('user.role', 'user_role')
      .addSelect('COALESCE(COUNT(tasks.id), 0)', 'totalFinishedTasksCount')
      .addSelect('COALESCE(SUM(tasks.hours), 0)', 'totalFinishedTaskHours')
      .groupBy('user.name');
  
    const users = await queryBuilder.getRawMany();
  
    if (users.length === 0) {
      throw new NotFoundException('No users found.');
    }
  
    return users;
  }
}
