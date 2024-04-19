import { Column, Entity,ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import {Task} from '../../task/entities/task.entity';

@Entity()
export class User {

  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryColumn()
  name: string;

  @Column({ type: 'varchar', length: 40 })
  email: string;

  @Column({ type: 'varchar', length: 15 })
  role: string;

  /* @ManyToMany(() => Task, (task) => task.users)
    tasks?: Task[] */

    @ManyToMany(
      () => Task,
      task => task.users,
      {onDelete: 'CASCADE', onUpdate: 'CASCADE',},
    )
    tasks?: Task[];

}