declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface ProcessEnv {
    readonly GITHUB_CLIENT_ID: string
    readonly GITHUB_CLIENT_SECRET: string
    readonly SESSION_SECRET: string
  }
}