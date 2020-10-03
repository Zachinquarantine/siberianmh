import { createConnection } from 'typeorm'

export const connectTypeorm = () => {
  return process.env.NODE_ENV === 'production'
    ? createConnection()
    : createConnection({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || 'root',
        database: 'siberianmh_arcadia_dev',
        synchronize: true,
        logging: true,
        entities: ['src/entities/**/*.ts'],
        migrations: ['src/migration/**/*.ts'],
        subscribers: ['src/subscriber/**/*.ts'],
        charset: 'utf8mb4_unicode_ci',
        cli: {
          entitiesDir: 'src/entites',
          migrationsDir: 'src/migration',
          subscribersDir: 'src/subscriber',
        },
      })
}
