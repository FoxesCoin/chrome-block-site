import { getProfiles } from "../utils";
import { BlockSiteManager } from "./block-site";

async function loadDocument() {
	const profiles = await getProfiles();
	BlockSiteManager.checkProfiles(profiles);
}

// TODO update to profile functional
chrome.storage.onChanged.addListener((changes) => {
	const newValue = changes?.profiles?.newValue;
	const oldValue = changes?.profiles?.oldValue;
	if (!newValue || !oldValue) {
		return;
	}

	//? Did profile ADDED?
	if (newValue.length > oldValue.length) {
		return;
	}

	BlockSiteManager.checkProfiles(newValue);
});

document.addEventListener("DOMContentLoaded", loadDocument);
