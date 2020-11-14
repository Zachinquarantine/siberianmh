import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity('reminder')
export class Reminder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar')
  userID: string

  @Column({ type: 'bigint' })
  date: number

  @Column('varchar')
  message: string
}
