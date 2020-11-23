import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('autorole')
export class Autorole extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column('varchar', { nullable: false })
  msg_id: string

  @Column('varchar', { nullable: false })
  role_id: string

  @Column('varchar', { nullable: false })
  emoji: string

  @Column('boolean', { default: true })
  auto_remove: boolean

  @CreateDateColumn()
  created_at: Date
}
