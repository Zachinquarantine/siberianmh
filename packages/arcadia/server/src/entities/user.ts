import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { unique: true, nullable: false })
  username: string

  @Column('varchar', { unique: true, nullable: false })
  email: string

  @Column('varchar', { nullable: true })
  avatar_url: string

  @Column('varchar', { nullable: false })
  password: string

  @Column('boolean', { default: false, nullable: false })
  site_admin: boolean

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
