import { createConnection } from 'typeorm'

export async function createTypeormConnection() {
  return process.env.NODE_ENV === 'production'
    ? createConnection()
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
