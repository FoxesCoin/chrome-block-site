import "./popup.css";

import { ProfileManager } from "../profile";
import { ProfileData } from "../utils";

const startRegExp = /https?:\/\/|www\./i;

const button = document.getElementById("add-site")!;

let url: string = "";

const clearUrl = (link: string) => {
	const newLink = link.replace(startRegExp, "");
	const index = newLink.indexOf("/");
	if (index !== -1) {
		return newLink.substring(0, newLink.indexOf("/"));
	}
	return newLink;
};

// @ts-ignore
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

	button.addEventListener("click", async () => {
		const sites = ProfileManager.activeProfile.sites;
		if (isIncludeSite(sites)) {
			return;
		}
		await ProfileManager.addSite(url);
		disabledButton("Completed!");
	});
});

// TODO update to profile functional
chrome.storage.onChanged.addListener((change) => {
	const id = ProfileManager.idProfile;
	const list = change.profiles.newValue.find(
		(profile: ProfileData) => profile.id === id
	);

	if (isIncludeSite(list)) {
		return disabledButton("Already added!");
	}
	activeButton("Add this site.");
});

const sites = ProfileManager.activeProfile.sites;
if (sites.some((site: any) => url && url.includes(site))) {
	disabledButton("Already added!");
}
