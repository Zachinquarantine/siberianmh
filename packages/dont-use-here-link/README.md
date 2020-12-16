# dont-use-here-link

> The simple library for preventing using of `here` as link in markdown files

## Install

```sh
$ npm install --save-dev dont-use-here-link
# or
$ yarn add dont-use-here-link --dev
```

## Usage

You can use these library from a cli or from import statement.

### Import like usage

```ts
import { verifyLinks } from 'dont-use-here-link'
// or
const { verifyLinks } = require('dont-use-here-link')

const hereLinks = async () => await verifyLinks('./blog') // can be folder or file

console.log(hereLinks().catch(() => {}))
// Checking all markdown files to ensure [here] not used for links…
//   Checking file: blog\text.md…
//   Checking file: blog\text2.md…
// [here] links were found.
// In file: blog/text.md
//  - Line 2: 'Follow along with the [Google Chromium blog](http://blog.chromium.org) to learn about features as new versions ship and again, you can check the version of Chromium that Electron uses [here](https://electronjs.org/#electron-versions).'
// Look for the source of these markdown and looks to not use [here] as link'.
```

### CLI like usage

```sh
npx dont-use-here-link <folder or file>
```

Example:

```sh
npx dont-use-here-link ./blog

> Checking all markdown files to ensure [here] not used for links…
>  Checking file: blog\text.md…
>  Checking file: blog\text2.md…
> [here] links were found.
> In file: blog/text.md
>  - Line 2: 'Follow along with the [Google Chromium blog](http://blog.chromium.org) to learn about features as new versions ship and again, you can check the version of Chromium that Electron uses [here](https://electronjs.org/#electron-versions).'
> Look for the source of these markdown and looks to not use [here] as link'.
```

### API

`verifyLinks(globRoot[, options])`

Arguments:

- globRoot String (required)
- options Object (optional)
  - searchWord String - Word what's need to search. Defaults `[here]`

## License

[MIT](https://github.com/siberianmh/siberianmh/blob/master/LICENSE.md)
