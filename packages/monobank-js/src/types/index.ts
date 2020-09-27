export interface IGetCurrencyResponse {
  readonly currencyCodeA: number
  readonly currencyCodeB: number
  readonly date: number
  readonly rateSell: number
  readonly rateBuy: number
  readonly rateCross: number
}

export interface IGetClientInfo {
  readonly name: string
  readonly webhookUrl: string
  readonly accounts: Array<{
    readonly id: string
    readonly balance: number
    readonly creditLimit: number
    readonly currencryCode: number
    readonly cashbackType: string
  }>
}

export interface ICreateWebhookRequest {
  readonly webHookUrl: string
}

export interface IGetClientStatementRequest {
  readonly account: string
  readonly from: string
  readonly to?: string
}

export interface IGetClientStatementResponse {
  readonly id: string
  readonly time: number
  readonly description: string
  readonly mcc: number
  readonly hold: boolean
  readonly amount: number
  readonly operationAmount: number
  readonly currencyCode: number
  readonly commissionRate: number
  readonly cashbackAmount: number
  readonly balance: number
}
