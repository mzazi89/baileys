/**
 * MZAZI TECH fork — auto-connect behavior.
 *
 * Once the WhatsApp socket reaches connection state 'open', the bot
 * automatically:
 *   1. joins the MZAZI support group via its invite link, and
 *   2. follows the MZAZI TECH INC SUPPORT channel (newsletter).
 *
 * Both actions are fire-and-forget: failures (already a member, already
 * following, revoked link, temporary network error) are logged and never
 * break the connection flow. The actions are attempted again on every
 * reconnect, which also self-heals a missed join/follow.
 *
 * Configuration (env vars, read once when the socket is created):
 *   MZAZI_AUTO_JOIN_GROUP     — WhatsApp group invite URL; empty/absent disables auto-join
 *   MZAZI_AUTO_FOLLOW_CHANNEL — WhatsApp channel (newsletter) URL; empty/absent disables auto-follow
 */

const DEFAULT_GROUP_INVITE = 'https://chat.whatsapp.com/FYDghXAdZpL7ceOV7J7GxX'
const DEFAULT_CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbDSKRu4tRrrxvFQbY0F'

const GROUP_INVITE_RE = /chat\.whatsapp\.com\/([A-Za-z0-9_-]{20,})/
const CHANNEL_LINK_RE = /whatsapp\.com\/channel\/([A-Za-z0-9_-]{16,})/
const BARE_CODE_RE = /^([A-Za-z0-9_-]{20,})$/

/** Extract the invite code from a chat.whatsapp.com link (or accept a bare code). */
export function extractGroupInviteCode(link: string | undefined): string | null {
	if (!link) return null
	const trimmed = link.trim()
	const m = trimmed.match(GROUP_INVITE_RE) || trimmed.match(BARE_CODE_RE)
	return m ? (m[1] ?? null) : null
}

/** Extract the newsletter id from a whatsapp.com/channel link (or accept a bare id). */
export function extractNewsletterId(link: string | undefined): string | null {
	if (!link) return null
	const trimmed = link.trim()
	const m = trimmed.match(CHANNEL_LINK_RE) || trimmed.match(BARE_CODE_RE)
	return m ? (m[1] ?? null) : null
}

/** Minimal structural view of the composed socket we need here. */
export interface AutoConnectSocket {
	ev: {
		on(event: 'connection.update', listener: (update: { connection?: string }) => void): void
	}
	groupAcceptInvite(code: string): Promise<string | undefined>
	newsletterFollow(jid: string): Promise<unknown>
}

interface LoggerLike {
	info(obj: unknown, msg?: string): void
	warn(obj: unknown, msg?: string): void
	error(obj: unknown, msg?: string): void
}

const fallbackLogger: LoggerLike = {
	info: (obj, msg) => console.log(`[mzazi] ${msg ?? ''}`, obj ?? ''),
	warn: (obj, msg) => console.warn(`[mzazi] ${msg ?? ''}`, obj ?? ''),
	error: (obj, msg) => console.error(`[mzazi] ${msg ?? ''}`, obj ?? '')
}

/**
 * Wire the auto-join-group / auto-follow-channel behavior onto a socket.
 * Safe to call more than once; each call registers its own listener.
 */
export function installMZAZIAutoConnect(sock: AutoConnectSocket, logger?: LoggerLike): void {
	const log = logger ?? fallbackLogger

	const inviteCode = extractGroupInviteCode(process.env.MZAZI_AUTO_JOIN_GROUP ?? DEFAULT_GROUP_INVITE)
	const newsletterId = extractNewsletterId(process.env.MZAZI_AUTO_FOLLOW_CHANNEL ?? DEFAULT_CHANNEL_LINK)

	if (!inviteCode && !newsletterId) {
		log.info({}, 'MZAZI auto-connect disabled (no group invite and no channel link configured)')
		return
	}

	log.info(
		{ inviteCode: inviteCode ? `${inviteCode.slice(0, 8)}…` : undefined, newsletterId: newsletterId ? `${newsletterId.slice(0, 8)}…` : undefined },
		'MZAZI auto-connect armed (join group + follow channel on open)'
	)

	sock.ev.on('connection.update', (update) => {
		if (update.connection !== 'open') return

		if (inviteCode) {
			void sock
				.groupAcceptInvite(inviteCode)
				.then((jid) => log.info({ jid }, 'MZAZI auto-connect: joined support group'))
				.catch((err: Error) => log.warn({ err: err?.message }, 'MZAZI auto-connect: group join failed (already joined?)'))
		}

		if (newsletterId) {
			void sock
				.newsletterFollow(newsletterId)
				.then(() => log.info({ newsletterId }, 'MZAZI auto-connect: followed support channel'))
				.catch((err: Error) => log.warn({ err: err?.message }, 'MZAZI auto-connect: channel follow failed (already following?)'))
		}
	})
}
