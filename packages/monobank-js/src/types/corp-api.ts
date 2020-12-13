export interface IInitializeRequestParams {
  /**
   * ID Service Key
   */
  readonly keyId: string

  /**
   * Current time in seconds (UTC)
   */
  readonly time: string

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
