import { Monobank } from '../'
import nock from 'nock'

nock.disableNetConnect()

describe('monobank', () => {
  test('getCurrency()', async () => {
    const mockResponse = [
      {
        currencyCodeA: 840,
        currencyCodeB: 980,
        date: 1601068206,
        rateBuy: 28.12,
        rateSell: 28.4083,
      },
      {
        currencyCodeA: 978,
        currencyCodeB: 980,
        date: 1601068206,
        rateBuy: 32.65,
        rateSell: 33.1104,
      },
    ]

    const mock = nock('https://api.monobank.ua')
      .get('/bank/currency')
      .reply(200, mockResponse)
    const mb = new Monobank()
    const result = await mb.getCurrency()

    expect(mock.isDone()).toBe(true)
    expect(result.data).toMatchSnapshot()
    expect(result.status).toBe(200)
  })
})
