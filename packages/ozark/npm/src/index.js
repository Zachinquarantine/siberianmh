#!/usr/bin/env node

const axios = require('axios').default

const providers = {
  GITHUB: 'GITHUB',
}

const makeRequest = async (data) => {
  const host = process.env.HOST
    ? process.env.HOST
    : 'https://ozark.example.com/api/ci/handle-status'

  const headers = process.env.SECRET
    ? { 'X-Ozark-Secret': process.env.SECRET }
    : undefined

  const resp = await axios.post(
    host,
    {
      providers: data.provider,
      repository: data.repository,
      sha: data.sha,
      ref: data.ref,
      ...data,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    },
  )

  if (resp.status !== 200) {
    console.log('Unable to send data to Ozark server.')
    console.log(resp.data)
    return process.exit(1)
  }

  return process.exit(0)
}

async function main() {
  if (!process.env.CI) {
    console.log('No in CI environment, exiting.')
    return process.exit(0)
  }

  // GitHub Actions
  if (process.env.GITHUB_ACTIONS) {
    const {
      GITHUB_RUN_ID,
      GITHUB_REPOSITORY,
      GITHUB_SHA,
      GITHUB_REF,
    } = process.env

    await makeRequest({
      provider: providers.GITHUB,
      workflow_id: GITHUB_RUN_ID,
      repository: GITHUB_REPOSITORY,
      sha: GITHUB_SHA,
      ref: GITHUB_REF,
    })
  }

  // CircleCI
  if (process.env.CIRCLECI) {
    console.log('CircleCI currently is not supported.')
    return process.exit(0)
  }

  // Travis CI
  if (process.env.TRAVIS) {
    console.log('Travis CI currently is not supported.')
    return process.exit(0)
  }

  // Appveyor
  if (process.env.APPVEYOR) {
    console.log('Appveyor currently is not supported.')
    return process.exit(0)
  }

  console.log('Unable to idenfity the CI provider.')
  return process.exit(1)
}

main().catch((err) => {
  console.log(err)
  process.exit(1)
})
