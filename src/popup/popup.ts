import "./popup.scss";

import { getUpdatedProfile } from "../utils";

const START_REG_EXP = /https?:\/\/|www\./i;

const button = document.getElementById("add-site")!;

let url: string = "";

const clearUrl = (link: string) => {
	const newLink = link.replace(START_REG_EXP, "");
	const index = newLink.indexOf("/");
	if (index !== -1) {
		return newLink.substring(0, newLink.indexOf("/"));
	}
	return newLink;
};

const isIncludeSite = (sites: string[] = []) =>
	sites.some((site) => url.includes(site));

function disabledButton(message: string) {
	button.setAttribute("disabled", "");
	button.innerHTML = message;
}

function activeButton(message: string) {
	button.removeAttribute("disabled");
	button.innerHTML = message;
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	const tabUrl = tabs.at(0)?.url;
	if (!tabUrl) {
		throw new Error("Tab url not found!");
	}
	url = clearUrl(tabUrl);

	// TODO update to profile functional
	button.addEventListener("click", async () => {
		// const sites = ProfileManager.activeProfile.sites;
		// if (isIncludeSite(sites)) {
		// 	return;
		// }
		// await ProfileManager.addSite(url);
		// disabledButton("Completed!");
	});
});

// TODO update to profile functional
chrome.storage.onChanged.addListener((change) => {
	if (!change?.profiles?.newValue) {
		return;
	}

	const { newValue, oldValue } = change.profiles;

	const { sites } = getUpdatedProfile(newValue, oldValue).newProfile;

	if (isIncludeSite(sites)) {
		return disabledButton("Already added!");
	}
	activeButton("Add this site.");
});
