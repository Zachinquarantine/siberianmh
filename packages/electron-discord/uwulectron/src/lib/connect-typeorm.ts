import { Connection, createConnection } from 'typeorm'
import * as path from 'path'
import { HelpUser } from '../entities/help-user'
import { Reminder } from '../entities/reminder'

export const connectTypeorm = (): Promise<Connection> => {
  const entitiesDir = path.resolve(__dirname, '../entities/**/*.js')
  return process.env.NODE_ENV === 'development'
    ? createConnection({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || 'root',
        database: 'uwulectron_dev',
        synchronize: true,
        logging: true,
        entities: [entitiesDir],
        migrations: ['src/migration/**/*.ts'],
        subscribers: ['src/subscriber/**/*.ts'],
        charset: 'utf8mb4_unicode_ci',
        cli: {
          entitiesDir: 'src/entites',
          migrationsDir: 'src/migration',
          subscribersDir: 'src/subscriber',
        },
      })
    : createConnection({
        type: 'mysql',
        host: process.env.MYSQL_HOST,
        port: 3306,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: 'uwulectron',
        // It's bad but we don't have here any strong data in db
        synchronize: true,
        logging: true,
        entities: [Reminder, HelpUser],
        charset: 'utf8mb4_unicode_ci',
        cache: {
          type: 'ioredis',
          options: {
            host: process.env.REDIS_HOST,
            port: 6379,
          },
        },
      })
}
