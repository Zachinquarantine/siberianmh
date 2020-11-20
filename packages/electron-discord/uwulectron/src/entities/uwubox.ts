import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('uwubox')
export class Uwubox extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar')
  userId: string

  @Column('varchar', { nullable: false })
  item: string

  @Column('int', { default: 1, nullable: false })
  count: number

  @CreateDateColumn()
  created_at: Date
}
