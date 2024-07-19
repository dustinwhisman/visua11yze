let scriptsEnabled = false;
globalThis.browser = globalThis.browser ?? chrome;

const contentScripts = [
	{
		id: 'info-js',
		js: ['rules/info/checks.js'],
		matches: ['*://*/*'],
	},
	{
		id: 'info-css',
		css: ['rules/info/checks.css'],
		matches: ['*://*/*'],
	},
	{
		id: 'warning-js',
		js: ['rules/warning/checks.js'],
		matches: ['*://*/*'],
	},
	{
		id: 'warning-css',
		css: ['rules/warning/checks.css'],
		matches: ['*://*/*'],
	},
	{
		id: 'error-js',
		js: ['rules/error/checks.js'],
		matches: ['*://*/*'],
	},
	{
		id: 'error-css',
		css: ['rules/error/checks.css'],
		matches: ['*://*/*'],
	},
];

const optionState = {
	info: true,
	warning: true,
	error: true,
};

const menuOptions = [
	{
		id: 'info',
		type: 'checkbox',
		title: 'Info',
		contexts: ['action'],
		checked: optionState.info,
	},
	{
		id: 'warning',
		type: 'checkbox',
		title: 'Warning',
		contexts: ['action'],
		checked: optionState.warning,
	},
	{
		id: 'error',
		type: 'checkbox',
		title: 'Error',
		contexts: ['action'],
		checked: optionState.error,
	},
];

const initializeContextMenuOptions = () => {
	menuOptions.forEach((option) => {
		browser.menus.create(option);
	});
};

const registerContentScripts = async () => {
	await browser.scripting.registerContentScripts(contentScripts);
};

const isScriptEnabled = (script) => {
	const scriptCategory = script.id.replace(/\-(css|js)/, '');
	return optionState[scriptCategory];
};

const toggleContentScripts = async (tab) => {
	const scripts = await browser.scripting.getRegisteredContentScripts({
		ids: contentScripts.map(({ id }) => id),
	});

	if (scriptsEnabled) {
		scripts.forEach((script) => {
			if (script.css) {
				browser.scripting.removeCSS({
					files: script.css,
					target: {
						tabId: tab.id,
					},
				});
				return;
			}
		});
	} else {
		scripts.forEach((script) => {
			const enabled = isScriptEnabled(script);
			if (script.js && enabled) {
				browser.scripting.executeScript({
					files: script.js,
					target: {
						tabId: tab.id,
					},
				});
				return;
			}

			if (script.css && enabled) {
				browser.scripting.insertCSS({
					files: script.css,
					target: {
						tabId: tab.id,
					},
				});
				return;
			}
		});
	}

	scriptsEnabled = !scriptsEnabled;
};

const toggleRules = async (event) => {
	const { checked, menuItemId } = event;
	optionState[menuItemId] = checked;
	const currentTabs = await browser.tabs.query({ active: true });
	const scripts = await browser.scripting.getRegisteredContentScripts({
		ids: [`${menuItemId}-js`, `${menuItemId}-css`],
	});
	currentTabs.forEach((tab) => {
		scripts.forEach((script) => {
			if (script.css && !checked) {
				browser.scripting.removeCSS({
					files: script.css,
					target: {
						tabId: tab.id,
					},
				});
				return;
			}

			if (checked && scriptsEnabled) {
				if (script.js) {
					browser.scripting.executeScript({
						files: script.js,
						target: {
							tabId: tab.id,
						},
					});
					return;
				}

				if (script.css) {
					browser.scripting.insertCSS({
						files: script.css,
						target: {
							tabId: tab.id,
						},
					});
					return;
				}
			}
		});
	});
};

browser.runtime.onInstalled.addListener(async () => {
	await registerContentScripts();
	initializeContextMenuOptions();
});

browser.action.onClicked.addListener(toggleContentScripts);
browser.menus.onClicked.addListener(toggleRules);
