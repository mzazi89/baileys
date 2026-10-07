// ─────────────────────────────────────────────────────────────────────────────
// scripts/patch-lib-extensions.cjs
//
// Runs AFTER `tsc && tsc-esm-fix`, and repairs two things about `lib/Extensions`
// that a plain build gets wrong — silently, which is the worst way to lose them.
//
// WHY THIS EXISTS
//
//   `MessageBuilderNew.js` (Button, ButtonV2, Carousel, AIRich, Quick, Toolkit) is
//   shipped INSIDE the library as a CommonJS file, fronted by a thin ESM wrapper
//   that lazy-loads it. Neither file is TypeScript, so the compiler cannot produce
//   them — and `tsc` does not copy non-TS files. Without this step they would be
//   missing from every build.
//
//   Two specific ways the pipeline damages them, both observed:
//
//   1. `lib/index.js` is generated from `src/index.ts`, which does NOT re-export
//      the Extensions. The export is added here instead. Rebuilding without it
//      removes `MessageBuilders` from the package's public surface: the package
//      still loads, the builders just quietly stop existing.
//
//   2. tsc-esm-fix runs with `--ext=.js` and rewrites every relative specifier to
//      `.js`, turning the wrapper's deliberate `require('./message-builders.cjs')`
//      into `.js` — which points the loader at the ESM wrapper itself rather than
//      the CommonJS implementation. `MessageBuilders.Button` then silently returns
//      undefined instead of throwing.
//
// The fix for both is to treat `src/Extensions/` as the source of truth and copy
// it over the build output, then assert the result actually resolves. Copying
// happens after the compiler has finished, so nothing can mangle it afterwards.
//
// CommonJS on purpose — the repo sets "type": "module", and this has to stay
// requireable from an npm script.
// ─────────────────────────────────────────────────────────────────────────────
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src", "Extensions");
const LIB = path.join(ROOT, "lib");
const EXT_DIR = path.join(LIB, "Extensions");
const INDEX = path.join(LIB, "index.js");

const EXPORT_LINE = "export * from './Extensions/message-builders.js';";
const FILES = ["message-builders.cjs", "message-builders.js"];

const done = [];
const fail = (msg) => {
	console.error(`\n❌ patch-lib-extensions: ${msg}\n`);
	process.exit(1);
};

// ── 0. the source of truth must exist ────────────────────────────────────────
if (!fs.existsSync(SRC_DIR)) {
	fail(
		`src/Extensions/ is missing. It holds the hand-written builder files, which the\n` +
			`   compiler cannot regenerate. Restore with:  git checkout src/Extensions`
	);
}
for (const f of FILES) {
	if (!fs.existsSync(path.join(SRC_DIR, f))) fail(`src/Extensions/${f} is missing`);
}

// ── 1. copy the hand-written files into the build output ─────────────────────
fs.mkdirSync(EXT_DIR, { recursive: true });
for (const f of FILES) {
	const from = path.join(SRC_DIR, f);
	const to = path.join(EXT_DIR, f);
	fs.copyFileSync(from, to);
	const bytes = fs.statSync(to).size;
	done.push(`copied src/Extensions/${f} -> lib/Extensions/${f}  (${bytes} bytes)`);
}

// ── 2. the package root must re-export the builders ──────────────────────────
if (!fs.existsSync(INDEX)) fail("lib/index.js not found — did tsc run?");
{
	const src = fs.readFileSync(INDEX, "utf8");
	if (src.includes(EXPORT_LINE)) {
		done.push("index.js already re-exports the builders");
	} else {
		const marker = "//# sourceMappingURL=index.js.map";
		if (!src.includes(marker)) {
			fail("lib/index.js has no sourceMappingURL marker to insert before");
		}
		fs.writeFileSync(INDEX, src.replace(marker, `${EXPORT_LINE}\n${marker}`));
		done.push("index.js: re-added the Extensions export (tsc had dropped it)");
	}
}

// ── 3. verify, because a string match is not proof ───────────────────────────
{
	const wrapper = fs.readFileSync(path.join(EXT_DIR, "message-builders.js"), "utf8");
	const m = wrapper.match(/require\('(\.\/message-builders\.\w+)'\)/);
	if (!m) fail("the wrapper has no recognisable lazy require — was it edited upstream?");

	const target = path.join(EXT_DIR, m[1]);
	if (!fs.existsSync(target)) {
		fail(
			`the wrapper loads ${m[1]}, which does not exist on disk.\n` +
				`   The builders would return undefined at runtime. Expected .cjs — check that\n` +
				`   tsc-esm-fix has not rewritten the specifier.`
		);
	}
	if (!m[1].endsWith(".cjs")) {
		fail(
			`the wrapper loads ${m[1]}, the ESM wrapper itself rather than the CommonJS\n` +
				`   implementation. This is the tsc-esm-fix --ext=.js rewrite. The build output\n` +
				`   must be copied AFTER tsc-esm-fix runs.`
		);
	}
	done.push(`wrapper resolves: ${m[1]} -> ${path.relative(ROOT, target)}`);

	if (!fs.readFileSync(INDEX, "utf8").includes(EXPORT_LINE)) {
		fail("lib/index.js still does not export the builders after patching");
	}
	done.push("verified: index.js re-exports MessageBuilders");
}

console.log("✅ patch-lib-extensions:");
for (const d of done) console.log(`   • ${d}`);
