import { BotSettings } from '../entities/settings'

export const getBotSettings = async () => {
  const db = await BotSettings.findOne({ name: 'electron' })

  if (!db) {
    console.log('[ERROR] Settings table is not found')
    return
  }

  return db
}

export const createSettings = async () => {
  let db = await BotSettings.findOne({ where: { name: 'electron' } })

  if (db) {
    return
  }

  db = await BotSettings.create({
    name: 'electron',
  }).save()

  return db
}
