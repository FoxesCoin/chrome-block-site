import { getSiteList, setSiteList } from "../utils";

const startRegExp = /https?:\/\/|www\./;

const button = document.getElementById("add-site")!;

let url: any;

const clearUrl = (link: any) => {
	const newLink = link.replace(startRegExp, "");
	const index = newLink.indexOf("/");
	if (index !== -1) {
		return newLink.substring(0, newLink.indexOf("/"));
	}
	return newLink;
};

// @ts-ignore
const isIncludeSite = (sites = []) => sites.some((site) => url.includes(site));

function disabledButton(message: any) {
	button.setAttribute("disabled", "");
	button.innerHTML = message;
}

function activeButton(message: any) {
	button.removeAttribute("disabled");
	button.innerHTML = message;
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	url = clearUrl(tabs[0].url);

	button.addEventListener("click", () => {
		getSiteList((sites: any) => {
			if (isIncludeSite(sites)) {
				return;
			}
			setSiteList([...sites, url], () => {
				disabledButton("Completed!");
			});
		});
	});
});

getSiteList((sites: any) => {
	if (sites.some((site: any) => url.includes(site))) {
		disabledButton("Already added!");
	}
});

chrome.storage.onChanged.addListener((changes) => {
	const list = changes?.sites?.newValue;
	if (!list) {
		return;
	}
	if (isIncludeSite(list)) {
		return disabledButton("Already added!");
	}
	activeButton("Add this site.");
});
