import { createConnection } from 'typeorm'
import * as path from 'path'

import { $AnyDueWeirdBazel } from './types'

export const connectTypeorm = (): Promise<$AnyDueWeirdBazel> => {
  const entitiesDir = path.resolve(__dirname, '../entites/**/*.js')
  return process.env.NODE_ENV === 'development'
    ? createConnection({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || 'root',
        database: 'siberianmh_arcadia_dev',
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
    : createConnection()
}
