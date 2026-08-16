import makeWASocket from './Socket/index.js';
import figlet from 'figlet';
// ─── MZAZI TECH fork banner ────────────────────────────────────────────────
// Printed to the console whenever the library is loaded (e.g. the bot starts).
// Disable with MZAZI_BANNER=0. Amber/cobalt truecolor on a dark terminal:
//   amber  #F2A93B -> \x1b[38;2;242;169;59m
//   cobalt #4C7DFC -> \x1b[38;2;76;125;252m
const AMBER = '\x1b[38;2;242;169;59m';
const COBALT = '\x1b[38;2;76;125;252m';
const GREY = '\x1b[90m';
const RESET = '\x1b[0m';
if (process.env.MZAZI_BANNER !== '0') {
    // eslint-disable-next-line no-console
    console.log(`${AMBER}${figlet.textSync('MZAZI', { font: 'ANSI Shadow' })}${RESET}`);
    // eslint-disable-next-line no-console
    console.log(`${COBALT}${figlet.textSync('BAILEYS', { font: 'ANSI Shadow' })}${RESET}`);
    // eslint-disable-next-line no-console
    console.log(`${GREY}MZAZI BAILEYS — custom fork by MZAZI TECH${RESET} ${AMBER}(MZAZIBOT pairing + button support)${RESET}`);
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