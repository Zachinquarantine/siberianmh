import * as Bull from 'bull'

const queueOptions: Bull.QueueOptions = {
  redis: process.env.REDIS_URL ?? undefined,
}

export const ciJobsQueue = new Bull('ci-jobs-queue', queueOptions)
export const notificationsQueue = new Bull('notifications', queueOptions)
