import { Collection, GuildChannel } from 'discord.js'
import { dormantChannelTimeout } from 'siberianmh/packages/electron-discord/common/src'

export const helpMessage = (
  availableChannels: Collection<string, GuildChannel>,
) => `
**How to Ask For Help**

Follow these guidelines below:

1. Does your question fit into a channel in topical chat in the \`Ecosystem\` or \`Frameworks\` categories? If so, post it in the appropriate channel.
2. If no, send a question to the ${availableChannels
  .map((channel) => `<#${channel.id}>`)
  .join(' or ')} channels in the \`❓ Help: Available\` category.
3. Our bot will move your channel to \`📝 Help: Ongoing\`
4. Somebody will (hopefully) come along and help you.

Channels will automatically be closed after \`${
  dormantChannelTimeout / 60 / 60
}\` hours of inactivity. Alternatively, you can close your channel using \`!close\` command.

After the channel has been closed, it will move into the \`Help: Dormant\` category at the bottom of channel list. It will then stay there until it gets recycled back into the \`Help: Available\` category to maintain the constant of two open channels.

When you share your question, include your **current version of Electron** (e.g. 10.0.0) and **operating system** (e.g. macOS Big Sur, Windows 10). If you can, try to reproduce the issue in Electron Fiddle: https://www.electronjs.org/fiddle.  You can then export your Fiddle code to a gist; include the link to your gist in your question.

We also recommend checking out a few places:
- **The Electron FAQ**: These are common issues that users have faced compiled in one place: <https://www.electronjs.org/docs/faq>
- **The core issue tracker**: Someone may have already identified your issue and shared a fix here: <https://github.com/electron/electron/issues>

**How To Get Answers**

We're very lucky to have members who volunteer their free time to help others. However, not all questions get answered the first time they get asked. There are some things that you can do to increase your chances of getting an answer, like proviing enough details and a minimal code example. If you can reproduce your inssue in Electron Fiddle, even better!
`
