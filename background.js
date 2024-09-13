let scriptsEnabled = false;
globalThis.browser = globalThis.browser ?? chrome;

const CATEGORIES = {
	'1-1-text-alternatives': '1.1 Text Alternatives',
	'1-2-time-based-media': '1.2 Time-based Media',
	'1-3-adaptable': '1.3 Adaptable',
	'1-4-distinguishable': '1.4 Distinguishable',
	info: 'Info',
	warning: 'Warning',
	error: 'Error',
};

const contentScripts = Object.keys(CATEGORIES)
	.map((category) => [
		{
			id: `${category}-js`,
			js: [`rules/${category}/checks.js`],
		},
		{
			id: `${category}-css`,
			css: [`rules/${category}/checks.css`],
		},
	])
	.flat();

const optionState = Object.keys(CATEGORIES).reduce(
	(acc, category) => ({
		...acc,
		[category]: true,
	}),
	{}
);

const menuOptions = Object.entries(CATEGORIES).map(([categoryKey, categoryName]) => ({
	id: categoryKey,
	type: 'checkbox',
	title: categoryName,
	contexts: ['action'],
	checked: optionState[categoryKey],
}));

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
