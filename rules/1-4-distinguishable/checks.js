(() => {
	// get links that aren't likely to be in a spot where it's evident they're links without extra decoration
	const inlineLinks = document.querySelectorAll('a:not(nav a, ul a, ol a)');
	inlineLinks.forEach((link) => {
		const styles = getComputedStyle(link);
		if (styles.textDecorationLine === 'none') {
			link.setAttribute('data-text-decoration', 'none');
		}
	});
})();
