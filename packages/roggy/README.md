# roggy

## Install

```sh
yarn add roggy
# or
npm install roggy
```

## Programmatic Usage

Require the function call it with any of the following:

- A remote branch name like `master`
- A version number, like `3.0.0`
- A version number that starts with a `v`, like `v1.0.0`
- A commit SHA, like `74603dec82800abe2f313d8edace189836d93432`
- A local directory, like `~/my/path/to/something-great`

Also you need provide owner and repository. Example:

```ts
import { roggy } from 'roggy'

const docs = await roggy('master', {
  owner: 'electron',
  repository: 'electron',
})
docs.forEach((doc) => {
  // docs is an array of objects, one for each markdwon file in /docs
})
```

Each object in the array looks like this:

```ts
{
  slug: 'chromium-rce-vulnerability',
  filename: 'chromium-rce-vulnerability.md',
  markdown_content: '---\ntitle: Chromium RCE Vulnerability Fix\nauthor: zeke\ndate: ' +
}
```

When fetchhing docs from a local directory, be sure to use a full path:

```ts
import * as path from 'path'
const docsPath = path.join(__dirname, 'docs')

roggy(docsPath, { owner: '', repository: '' }).then((docs) => {
  // ...
})
```

## License

[MIT](https://github.com/siberianmh/siberianmh/blob/master/LICENSE.md)
