import makeWASocket from './Socket/index'
import figlet from 'figlet'
import gradient from 'gradient-string'

// ─── MZAZI TECH fork banner ────────────────────────────────────────────────
// Rainbow block-letter banner printed to the console whenever the library is
// loaded (e.g. the bot starts). Disable with MZAZI_BANNER=0.
if (process.env.MZAZI_BANNER !== '0') {
	// eslint-disable-next-line no-console
	console.log(gradient.rainbow(figlet.textSync('MZAZI', { font: 'ANSI Shadow' })))
	// eslint-disable-next-line no-console
	console.log(gradient.rainbow(figlet.textSync('BAILEYS', { font: 'ANSI Shadow' })))
	// eslint-disable-next-line no-console
	console.log(' MZAZI BAILEYS — custom fork by MZAZI TECH (MZAZIBOT pairing + button support)')
}

export * from '../WAProto/index.js'
export * from './Utils/index'
export * from './Types/index'
export * from './Defaults/index'
export * from './WABinary/index'
export * from './WAM/index'
export * from './WAUSync/index'

export type WASocket = ReturnType<typeof makeWASocket>
export { makeWASocket }
export default makeWASocket
