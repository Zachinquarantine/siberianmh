import { Inhibitor } from 'cookiecord'

export const isTrustedMember: Inhibitor = async (msg) => {
  if (!msg.guild || !msg.member || msg.channel.type !== 'text') {
    // eslint-disable-next-line
    return ":warning: you can't use that command here"
  }

  if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
    // eslint-disable-next-line
    return ":warning: you don't have permissions to use that command."
  }
}
