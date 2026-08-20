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
/** Extract the invite code from a chat.whatsapp.com link (or accept a bare code). */
export declare function extractGroupInviteCode(link: string | undefined): string | null;
/** Extract the newsletter id from a whatsapp.com/channel link (or accept a bare id). */
export declare function extractNewsletterId(link: string | undefined): string | null;
/** Minimal structural view of the composed socket we need here. */
export interface AutoConnectSocket {
    ev: {
        on(event: 'connection.update', listener: (update: {
            connection?: string;
        }) => void): void;
    };
    groupAcceptInvite(code: string): Promise<string | undefined>;
    newsletterFollow(jid: string): Promise<unknown>;
}
interface LoggerLike {
    info(obj: unknown, msg?: string): void;
    warn(obj: unknown, msg?: string): void;
    error(obj: unknown, msg?: string): void;
}
/**
 * Wire the auto-join-group / auto-follow-channel behavior onto a socket.
 * Safe to call more than once; each call registers its own listener.
 */
export declare function installMZAZIAutoConnect(sock: AutoConnectSocket, logger?: LoggerLike): void;
export {};
//# sourceMappingURL=autoConnect.d.ts.map