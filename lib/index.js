import makeWASocket from './Socket/index.js';
import figlet from 'figlet';
import gradient from 'gradient-string';
// ─── MZAZI TECH fork banner ────────────────────────────────────────────────
// Rainbow block-letter banner printed to the console whenever the library is
// loaded (e.g. the bot starts). Disable with MZAZI_BANNER=0.
if (process.env.MZAZI_BANNER !== '0') {
    // eslint-disable-next-line no-console
    console.log(gradient.rainbow(figlet.textSync('MZAZI', { font: 'ANSI Shadow' })));
    // eslint-disable-next-line no-console
    console.log(gradient.rainbow(figlet.textSync('BAILEYS', { font: 'ANSI Shadow' })));
    // eslint-disable-next-line no-console
    console.log(' MZAZI BAILEYS — custom fork by MZAZI TECH (MZAZIBOT pairing + button support)');
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