import { Inhibitor } from 'cookiecord'
import { trustedRoleId } from '@edis/common'

export const isTrustedMember: Inhibitor = async (msg) => {
  if (!msg.guild || !msg.member || msg.channel.type !== 'text') {
    return ":warning: you can't use that command here"
  }

  if (
    !msg.member.hasPermission('MANAGE_MESSAGES') &&
    !msg.member.roles.cache.has(trustedRoleId)
  ) {
    return ":warning: you don't have permissions to use that command."
  }
}
