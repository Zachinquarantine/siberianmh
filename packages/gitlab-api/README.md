# GitLab API

## Installing

```sh
yarn add @siberianmh/gitlab-api
# or
npm install @siberianmh/gitlab-api
```

## Usage

> 🚦 This project implements API endpoints what are we would to use itself, if
> you need other API endpoints, feel free to contribute or open issue

```ts
import { GitLab } from '@siberianmh/gitlab-api'

const gitlab = new GitLab({
  hostname: 'https://gitlab.example.com',
  token: 'XXXXX',
})

async function main() {
  const { data } = await gitlab.mergeRequest.getMergeRequest({
    project_id: 1,
    merge_request_iid: 1,
  })

  console.log(data)
}

main().catch((err) => {
  console.log(err)
  process.exit(1)
})
```

## License

[MIT](https://github.com/siberianmh/siberianmh/blob/master/LICENSE.md)
