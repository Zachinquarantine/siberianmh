import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { PullRequest } from './pull-request'

@Entity('merge_queue')
export class MergeQueue extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('int')
  position: number

  @ManyToOne(() => PullRequest, (pr) => pr.id, {
    primary: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  pull_request: PullRequest

  @CreateDateColumn()
  created_at: Date
}
