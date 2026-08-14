import makeWASocket from './Socket/index'

// ─── MZAZI TECH fork banner ────────────────────────────────────────────────
// Printed to the console whenever the library is loaded (e.g. the bot starts).
// Disable with MZAZI_BANNER=0.
if (process.env.MZAZI_BANNER !== '0') {
	// eslint-disable-next-line no-console
	console.log(String.raw`
 __  __ _____   _     ________   ____    _    ___ _     _______   ______  
|  \/  |__  /  / \   |__  /_ _| | __ )  / \  |_ _| |   | ____\ \ / / ___| 
| |\/| | / /  / _ \    / / | |  |  _ \ / _ \  | || |   |  _|  \ V /\___ \ 
| |  | |/ /_ / ___ \  / /_ | |  | |_) / ___ \ | || |___| |___  | |  ___) |
|_|  |_/____/_/   \_\/____|___| |____/_/   \_\___|_____|_____| |_| |____/ 
`)
	// eslint-disable-next-line no-console
	console.log(' MZAZI BAILEYS — custom fork by MZAZI TECH (MZAZIBOT pairing + gifted-btns)')
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
