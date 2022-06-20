const isIncludeSite = (sites = [], url) =>
	sites.some((site) => url.includes(site));
