let scriptsEnabled = false;
globalThis.browser = globalThis.browser ?? chrome;

async function registerContentScripts() {
	await browser.scripting.registerContentScripts([
		{
			id: 'ana11yze.js',
			js: ['ana11yze.js'],
			matches: ['*://*/*'],
		},
		{
			id: 'visua11yze.css',
			css: ['visua11yze.css'],
			matches: ['*://*/*'],
		},
	]);
}

async function toggleContentScripts(tab) {
	const scripts = await browser.scripting.getRegisteredContentScripts({
		ids: [
			'ana11yze.js',
			'visua11yze.css',
		],
	});

	if (scriptsEnabled) {
		scripts.forEach((script) => {
			if (script.css) {
				browser.scripting.removeCSS({
					files: script.css,
					target: {
						tabId: tab.id
					}
				});
				return;
			}
		});
	} else {
		scripts.forEach((script) => {
			if (script.js) {
				browser.scripting.executeScript({
					files: script.js,
					target: {
						tabId: tab.id
					}
				});
				return;
			}

			if (script.css) {
				browser.scripting.insertCSS({
					files: script.css,
					target: {
						tabId: tab.id
					}
				});
				return;
			}
		});
	}

	scriptsEnabled = !scriptsEnabled;
}

browser.action.onClicked.addListener(toggleContentScripts);

registerContentScripts();