import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { BlockTypes } from '../lib/types'

@Entity('blocked')
export class Blocked extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar')
  userId: string

  @Column('varchar')
  reason: string

  @Column('int')
  type: BlockTypes

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
