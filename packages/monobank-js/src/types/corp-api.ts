export interface ICorpAPIBase {
  /**
   * ID key of the service
   */
  readonly keyId: string

  /**
   * Current time in seconds (UTC)
   */
  readonly time: string
}

export interface IInitializeAccessParams extends ICorpAPIBase {
  /**
   * List of the rights that service wants to receive
   * from the client (1 letter per 1 permission).
   * List of possible rights:
   *
   *  * s - statement (includes balance sheet and statement itself)
   *  * p - personal information (surname and name)
   */
  readonly permissions: string

  /**
   * Sign (X-Time | X-Permissions | URL)
   */
  readonly sign: string

  /**
   * The URL of callback that will be requested by the service
   * when the the client confirms granting access.
   * (GET request with X-Request-Id header)
   */
  readonly callback?: string
}

export interface ITokenRequest {
  /**
   * Grants token ID
   */
  readonly tokenRequestId: string

  /**
   * URL to display to the client as a QR or redirect to the page
   * of the client uses a smaptphone/tablet
   */
  readonly acceptUrl: string
}

export interface ICheckAccessParams extends ICorpAPIBase {
  /**
   * Request id
   */
  readonly requestId: string

  /**
   * Sign (X-time | X-RequestId | URL)
   */
  readonly sign: string
}

export interface IGetClientInfoParams extends ICorpAPIBase {
  /**
   * Request id
   */
  readonly requestId: string

  /**
   * Sign (X-time | X-RequestId | URL)
   */
  readonly sign: string
}

export interface IGetClientInfoResponse {
  name: string
  accounts: Array<IClientAccounts>
}

export interface IClientAccounts {
  readonly id: string
  readonly balance: number
  /** Credit limit */
  readonly creditLimit: string
  readonly currencyCode: number
  readonly cashbackType: 'None' | 'UAH' | 'Miles'
}
