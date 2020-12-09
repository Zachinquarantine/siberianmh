;(async () => {
  const { GH_TOKEN, GITHUB_TOKEN } = process.env
  const { GL_TOKEN, GITLAB_TOKEN } = process.env

  if (!GH_TOKEN && !GITHUB_TOKEN && !GL_TOKEN && !GITLAB_TOKEN) {
    console.error(
      'One of the following envs should be provided to setup usage: GH_TOKEN, GITHUB_TOKEN, GL_TOKEN, GITLAB_TOKEN',
    )
    process.exit(1)
  }
})()
