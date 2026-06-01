import adapter from '@sveltejs/adapter-node';
import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';
import 'prism-svelte';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Pre-load bahasa yang dipakai di konten .md supaya tidak ada
// log "failed to load language" dari mdsvex saat build.
loadLanguages([
	'markup',
	'css',
	'clike',
	'javascript',
	'typescript',
	'json',
	'bash',
	'yaml',
	'toml',
	'python',
	'rust',
	'sql',
	'diff'
]);

const escapeHtml = (str) =>
	str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

const escapeSvelty = (str) =>
	str
		.replace(/[{}`]/g, (c) => ({ '{': '&#123;', '}': '&#125;', '`': '&#96;' }[c]))
		.replace(/\\([trn])/g, '&#92;$1');

const aliasMap = {
	ts: 'typescript',
	js: 'javascript',
	sh: 'bash',
	shell: 'bash',
	yml: 'yaml',
	sv: 'svelte',
	html: 'markup',
	xml: 'markup'
};

/** Custom highlighter pakai prismjs langsung — bypass loader bawaan mdsvex. */
function highlighter(code, lang) {
	const normalized = (lang || '').toLowerCase();
	const resolved = aliasMap[normalized] || normalized;
	const grammar = resolved && Prism.languages[resolved];
	const body = grammar
		? Prism.highlight(code, grammar, resolved)
		: escapeHtml(code);
	const safe = escapeSvelty(body);
	const cls = resolved ? ` class="language-${resolved}"` : '';
	return `<pre${cls}>{@html \`<code${cls}>${safe}</code>\`}</pre>`;
}

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	highlight: { highlighter },
	layout: {
		_: resolve(__dirname, './src/lib/layouts/ArticleLayout.svelte')
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	compilerOptions: {
		runes: ({ filename }) => {
			if (filename.endsWith('.md')) return false;
			return filename.split(/[/\\]/).includes('node_modules') ? undefined : true;
		}
	},
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter()
	}
};

export default config;
