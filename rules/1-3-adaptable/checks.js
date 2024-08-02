(() => {
	const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
	const levelOneHeadings = [];
	for (const heading of headings) {
		if (heading.tagName === 'H1') {
			levelOneHeadings.push(heading);
		}
	}

	if (levelOneHeadings.length < 1) {
		console.warn(
			'This page does not have a level one heading. Consider adding one to describe/identify the page.'
		);
	} else if (levelOneHeadings.length > 1) {
		console.error(
			`This page has ${levelOneHeadings.length} level one headings. Only one is allowed in practice, and it should describe/identify the entire page.`
		);
		for (const heading of levelOneHeadings) {
			heading.setAttribute('data-duplicate-level-one-heading', '');
		}
	}
})();
