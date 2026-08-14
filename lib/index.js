import makeWASocket from './Socket/index.js';
// ─── MZAZI TECH fork banner ────────────────────────────────────────────────
// Printed to the console whenever the library is loaded (e.g. the bot starts).
// Disable with MZAZI_BANNER=0.
if (process.env.MZAZI_BANNER !== '0') {
    // eslint-disable-next-line no-console
    console.log(String.raw `
 __  __ _____   _     ________   ____    _    ___ _     _______   ______  
|  \/  |__  /  / \   |__  /_ _| | __ )  / \  |_ _| |   | ____\ \ / / ___| 
| |\/| | / /  / _ \    / / | |  |  _ \ / _ \  | || |   |  _|  \ V /\___ \ 
| |  | |/ /_ / ___ \  / /_ | |  | |_) / ___ \ | || |___| |___  | |  ___) |
|_|  |_/____/_/   \_\/____|___| |____/_/   \_\___|_____|_____| |_| |____/ 
`);
    // eslint-disable-next-line no-console
    console.log(' MZAZI BAILEYS — custom fork by MZAZI TECH (MZAZIBOT pairing + gifted-btns)');
}
export * from '../WAProto/index.js';
export * from './Utils/index.js';
export * from './Types/index.js';
export * from './Defaults/index.js';
export * from './WABinary/index.js';
export * from './WAM/index.js';
export * from './WAUSync/index.js';
export { makeWASocket };
export default makeWASocket;
//# sourceMappingURL=index.js.map