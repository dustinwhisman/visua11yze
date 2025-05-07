globalThis.browser = globalThis.browser ?? chrome;

const CATEGORIES = [
	'1-1-text-alternatives',
	'1-2-time-based-media',
	'1-3-adaptable',
	'1-4-distinguishable',
	'2-1-keyboard-accessible',
];

const contentScripts = CATEGORIES.map((category) => [
	{
		id: `${category}-js`,
		js: [`/rules/${category}/checks.js`],
	},
	{
		id: `${category}-css`,
		css: [`/rules/${category}/checks.css`],
	},
]).flat();

const getTabId = async () => {
	const tabs = await browser.tabs.query({ active: true, currentWindow: true });
	const tabId = tabs[0].id;
	return tabId;
};

const clearCurrentStylesheets = async () => {
	const tabId = await getTabId();
	for (const script of contentScripts) {
		if (!script.css) {
			continue;
		}

		try {
			await browser.scripting.removeCSS({
				files: script.css,
				target: {
					tabId,
				},
				origin: 'USER',
			});
		} catch (error) {
			console.error(error);
		}
	}
};

const registerRules = async (rules) => {
	const tabId = await getTabId();
	for (const script of contentScripts) {
		if (!rules.some((rule) => script.id.startsWith(rule))) {
			continue;
		}

		try {
			switch (true) {
				case script.js != null:
					browser.scripting.executeScript({
						files: script.js,
						target: {
							tabId,
						},
					});
					break;
				case script.css != null:
					browser.scripting.insertCSS({
						files: script.css,
						target: {
							tabId,
						},
						origin: 'USER',
					});
					break;
				default:
					break;
			}
		} catch (error) {
			console.error(error);
		}
	}
};

const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const data = new FormData(event.target);
	const rules = data.getAll('rules');

	await clearCurrentStylesheets();
	await registerRules(rules);
});
