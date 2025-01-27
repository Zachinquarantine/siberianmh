export const defaultData = {
  version: 2,
  updates: [
    {
      'package-ecosystem': 'npm',
      directory: '/',
      schedule: {
        interval: 'daily',
        time: '03:00',
      },
      milestone: 1,
      'open-pull-requests-limit': 999,
    },
    {
      'package-ecosystem': 'github-actions',
      directory: '/',
      schedule: {
        interval: 'daily',
        time: '03:00',
      },
      milestone: 1,
      'open-pull-requests-limit': 999,
    },
  ],
}
