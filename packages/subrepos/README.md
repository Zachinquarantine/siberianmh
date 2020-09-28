# subrepos

> The package manager for subrepositories (submodules).

## Install

```sh
npm install -g subrepos
# or
yarn global add subrepos
```

## Usage

For using `subrepos` you need to create the `subrepos.yml` file inside the root
directory. You can see the example content of `subrepos.yml` file below:

```yml
# Repository 1
- name: fiddle
  directory: vendor/fiddle
  commit: 8e92183de2b91b2727cc7408bb43987f264c2b37
  url: https://github.com/electron/fiddle.git
# Repository 2
- name: apps-review-tool
  directory: vendor/something-other
  commit: b28b4d6518478998fd519f3ee07f484fa13d7278
  url: https://github.com/HashimotoYT/apps-review-tool
# Repository 3, with non-default branch
- name: VSCode
  directory: source/vscode
  commit: 5763d909d5f12fe19f215cbfdd29a91c0fa9208a
  url: https://github.com/microsoft/vscode
  branch: release/1.45
```

`directory` uses to provide a folder where the content is cloned, `commit` the
commit of vendor repository, `url` the repository url. After providing these
fields you can run `subrepos install` to install sub repositories.

## Commands

### `subrepos` or `subrepos install`

Install the subrepositories

### `subrepos outdated`

Show the oudated subrepositories.

## License

[MIT](https://github.com/siberianmh/siberianmh/blob/master/LICENSE.md)
