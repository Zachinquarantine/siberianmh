import { createConnection } from 'typeorm'
import * as path from 'path'
import { Autorole } from '../entities/autorole'
import { HelpUser } from '../entities/help-user'

export const connectMySQL = () => {
  const entitiesDir = path.resolve(__dirname, '../entities/**/*.js')
  return process.env.NODE_ENV === 'development'
    ? createConnection({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || 'root',
        database: 'electron_discord_dev',
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
        database: 'electron_discord',
        // It's bad but we don't have here any strong data in db
        synchronize: true,
        logging: true,
        entities: [Autorole, HelpUser],
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
