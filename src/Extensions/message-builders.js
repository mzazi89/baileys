import { createRequire } from 'module';

const require = createRequire(import.meta.url);

let cached;

/**
 * The interactive message builders — Button, ButtonV2, Carousel, AIRich, Quick,
 * Toolkit.
 *
 * Loaded on first access rather than at import time, on purpose. These pull in
 * sharp and fluent-ffmpeg, which a plain baileys install does not have; keeping
 * the load lazy means a missing one of those breaks only the call that asked for
 * the builders, never baileys itself.
 */
export function getMessageBuilders() {
	if (!cached) {
		cached = require('./message-builders.cjs');
	}
	return cached;
}

/** Lazy view of the builders, so `baileys.MessageBuilders.Button` just works. */
export const MessageBuilders = new Proxy({}, {
	get: (_target, prop) => getMessageBuilders()[prop],
	has: (_target, prop) => prop in getMessageBuilders(),
	ownKeys: () => Reflect.ownKeys(getMessageBuilders()),
	getOwnPropertyDescriptor: (_target, prop) => ({
		enumerable: true,
		configurable: true,
		get: () => getMessageBuilders()[prop],
	}),
});

export default MessageBuilders;
