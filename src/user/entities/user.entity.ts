import { Column, Entity,ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import {Task} from '../../task/entities/Task.entity';

@Entity()
export class User {

  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
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
      {onDelete: 'NO ACTION', onUpdate: 'NO ACTION',},
    )
    tasks?: Task[];

}