# monobank-js

> A Node.js wrapper for the Monobank API

## Installation

```sh
yarn add monobank-js
```

## Usage

```typescript
import { Monobank } from 'monobank-js'

const monobank = new Monobank({ token: 'token' })

monobank.getCurrency().then(({ data }) => {
  console.log(data)
  // =>
  // [
  //   {
  //     currencyCodeA: 840,
  //     currencyCodeB: 980,
  //     date: 1601068206,
  //     rateBuy: 28.12,
  //     rateSell: 28.4083
  //   },
  //   {
  //     currencyCodeA: 978,
  //     currencyCodeB: 980,
  //     date: 1601068206,
  //     rateBuy: 32.65,
  //     rateSell: 33.1104
  //   },
  // ...
})
```

## Contributing

We would love you to contribute to `monobank-js`, pull requests are very
welcome!

## License

[MIT](https://github.com/siberianmh/siberianmh/blob/master/LICENSE.md)
