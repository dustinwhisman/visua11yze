(() => {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
	console.log({ headings });
	const levelOneHeadings = [];
	let previousHeadingLevel;
	for (const heading of headings) {
		switch (heading.tagName) {
			case 'H1':
				levelOneHeadings.push(heading);

				if (previousHeadingLevel != null) {
					heading.setAttribute('data-heading-out-of-order', '');
				}
				break;
			case 'H2':
				if (previousHeadingLevel == null) {
					heading.setAttribute('data-heading-out-of-order', '');
					heading.setAttribute('data-skipped-level-one', '');
				}
				break;
			case 'H3':
				if (previousHeadingLevel == null) {
					heading.setAttribute('data-heading-out-of-order', '');
					heading.setAttribute('data-skipped-level-one', '');
				}

				if (previousHeadingLevel === 'H1') {
					heading.setAttribute('data-heading-out-of-order', '');
					heading.setAttribute('data-skipped-level-two', '');
				}
				break;
			case 'H4':
				if (previousHeadingLevel == null) {
					heading.setAttribute('data-heading-out-of-order', '');
					heading.setAttribute('data-skipped-level-one', '');
				}

				if (previousHeadingLevel === 'H1') {
					heading.setAttribute('data-heading-out-of-order', '');
					heading.setAttribute('data-skipped-level-two', '');
				}

				if (previousHeadingLevel === 'H2') {
					heading.setAttribute('data-heading-out-of-order', '');
					heading.setAttribute('data-skipped-level-three', '');
				}
				break;
			case 'H5':
				if (previousHeadingLevel == null) {
					heading.setAttribute('data-heading-out-of-order', '');
					heading.setAttribute('data-skipped-level-one', '');
				}

				if (previousHeadingLevel === 'H1') {
					heading.setAttribute('data-heading-out-of-order', '');
					heading.setAttribute('data-skipped-level-two', '');
				}

				if (previousHeadingLevel === 'H2') {
					heading.setAttribute('data-heading-out-of-order', '');
					heading.setAttribute('data-skipped-level-three', '');
				}

				if (previousHeadingLevel === 'H3') {
					heading.setAttribute('data-heading-out-of-order', '');
					heading.setAttribute('data-skipped-level-four', '');
				}
				break;
			case 'H6':
				if (previousHeadingLevel == null) {
					heading.setAttribute('data-heading-out-of-order', '');
					heading.setAttribute('data-skipped-level-one', '');
				}

				if (previousHeadingLevel === 'H1') {
					heading.setAttribute('data-heading-out-of-order', '');
					heading.setAttribute('data-skipped-level-two', '');
				}

				if (previousHeadingLevel === 'H2') {
					heading.setAttribute('data-heading-out-of-order', '');
					heading.setAttribute('data-skipped-level-three', '');
				}

				if (previousHeadingLevel === 'H3') {
					heading.setAttribute('data-heading-out-of-order', '');
					heading.setAttribute('data-skipped-level-four', '');
				}

				if (previousHeadingLevel === 'H4') {
					heading.setAttribute('data-heading-out-of-order', '');
					heading.setAttribute('data-skipped-level-five', '');
				}
				break;
			default:
				break;
		}

		previousHeadingLevel = heading.tagName;
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
