let scriptsEnabled = false;
globalThis.browser = globalThis.browser ?? chrome;

const contentScripts = [
	{
		id: '1-1-text-alternatives-js',
		js: ['rules/1-1-text-alternatives/checks.js'],
	},
	{
		id: '1-1-text-alternatives-css',
		css: ['rules/1-1-text-alternatives/checks.css'],
	},
	{
		id: 'info-js',
		js: ['rules/info/checks.js'],
	},
	{
		id: 'info-css',
		css: ['rules/info/checks.css'],
	},
	{
		id: 'warning-js',
		js: ['rules/warning/checks.js'],
	},
	{
		id: 'warning-css',
		css: ['rules/warning/checks.css'],
	},
	{
		id: 'error-js',
		js: ['rules/error/checks.js'],
	},
	{
		id: 'error-css',
		css: ['rules/error/checks.css'],
	},
];

const optionState = {
	'1-1-text-alternatives': true,
	info: true,
	warning: true,
	error: true,
};

const menuOptions = [
	{
		id: '1-1-text-alternatives',
		type: 'checkbox',
		title: '1.1 Text Alternatives',
		contexts: ['action'],
		checked: optionState['1-1-text-alternatives'],
	},
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
	for (const option of menuOptions) {
		browser.contextMenus.create(option);
	}
};

const registerContentScripts = async () => {
	await browser.scripting.registerContentScripts(contentScripts);
};

const isScriptEnabled = (script) => {
	const scriptCategory = script.id.replace(/\-(css|js)/, '');
	return optionState[scriptCategory];
};

const toggleContentScripts = async (tab) => {
	if (scriptsEnabled) {
		for (const script of contentScripts) {
			if (script.css) {
				browser.scripting.removeCSS({
					files: script.css,
					target: {
						tabId: tab.id,
					},
					origin: 'USER',
				});
			}
		}
	} else {
		for (const script of contentScripts) {
			const enabled = isScriptEnabled(script);
			if (script.js && enabled) {
				browser.scripting.executeScript({
					files: script.js,
					target: {
						tabId: tab.id,
					},
				});
				continue;
			}

			if (script.css && enabled) {
				browser.scripting.insertCSS({
					files: script.css,
					target: {
						tabId: tab.id,
					},
					origin: 'USER',
				});
			}
		}
	}

	scriptsEnabled = !scriptsEnabled;
};

const toggleRules = async (info, tab) => {
	const { checked, menuItemId } = info;
	optionState[menuItemId] = checked;
	const scripts = contentScripts.filter(({ id }) => id.replace(/\-(js|css)/, '') === menuItemId);
	for (const script of scripts) {
		if (script.css && !checked) {
			browser.scripting.removeCSS({
				files: script.css,
				target: {
					tabId: tab.id,
				},
				origin: 'USER',
			});
			continue;
		}

		if (checked && scriptsEnabled) {
			if (script.js) {
				browser.scripting.executeScript({
					files: script.js,
					target: {
						tabId: tab.id,
					},
				});
				continue;
			}

			if (script.css) {
				browser.scripting.insertCSS({
					files: script.css,
					target: {
						tabId: tab.id,
					},
					origin: 'USER',
				});
			}
		}
	}
};

browser.runtime.onInstalled.addListener(async () => {
	initializeContextMenuOptions();
});

browser.action.onClicked.addListener(toggleContentScripts);
browser.contextMenus.onClicked.addListener(toggleRules);
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete') {
		scriptsEnabled = !scriptsEnabled;
		toggleContentScripts(tab);
	}
});
