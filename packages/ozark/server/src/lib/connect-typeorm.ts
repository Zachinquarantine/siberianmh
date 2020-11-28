import { createConnection } from 'typeorm'
import { ACL } from '../entities/acl'
import { Repository } from '../entities/repo'
import { RepoJobs, RepoJobsRuns } from '../entities/status'
import { User } from '../entities/user'

export async function createTypeormConnection() {
  return process.env.NODE_ENV !== 'development'
    ? createConnection({
        type: 'mysql',
        host: process.env.MYSQL_HOST || 'localhost',
        port: 3306,
        username: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || 'root',
        database: process.env.MYSQL_DATABASE || 'siberianmh_ozark',
        synchronize: true,
        logging: true,
        entities: [ACL, RepoJobs, RepoJobsRuns, Repository, User],
      })
    : createConnection({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || 'root',
        database: 'siberianmh_ozark_dev',
        synchronize: true,
        logging: true,
        entities: ['src/entities/**/*.ts'],
        migrations: ['src/migration/**/*.ts'],
        subscribers: ['src/subscriber/**/*.ts'],
        charset: 'utf8mb4_unicode_ci',
        cli: {
          entitiesDir: 'src/entities',
          migrationsDir: 'src/migration',
          subscribersDir: 'src/subscriber',
        },
      })
}
