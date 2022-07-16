const START_REG_EXP = /https?:\/\/|www\./i;
export let siteUrl = "";

const clearUrl = (link: string) => {
	const newLink = link.replace(START_REG_EXP, "");
	const index = newLink.indexOf("/");
	if (index !== -1) {
		return newLink.substring(0, newLink.indexOf("/"));
	}
	return newLink;
};

export const isIncludeSite = (sites: string[] = []) =>
	sites.some((site) => siteUrl.includes(site));

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	const tabUrl = tabs.at(0)?.url;
	if (!tabUrl) {
		throw new Error("Tab url not found!");
	}
	siteUrl = clearUrl(tabUrl);
});
