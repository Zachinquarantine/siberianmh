import { Connection, createConnection, ConnectionOptions } from 'mysql'
import { IConfig } from './interfaces'

export class Client {
  private _connection: Connection

  public connect(config: string | IConfig): Promise<void> {
    this._connection = createConnection(config)

    return new Promise((resolve, reject) => {
      this._connection.connect((err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._connection.end((err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  public switchUser(config: ConnectionOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      this._connection.changeUser(config, (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  public query<T = any>(sql: string, values?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this._connection.query(sql, values, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }
}
