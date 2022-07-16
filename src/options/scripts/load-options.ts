import { ProfileManager } from "./profile";

const addButton = document.querySelector(".profile-wrapper__add")!;

addButton.addEventListener("click", () => {
	ProfileManager.createProfile();
});

chrome.storage.onChanged.addListener((change) => {
	const newValue = change?.profiles?.newValue;
	if (!newValue) {
		return;
	}

	ProfileManager.updateProfiles(newValue);
});

document.addEventListener("DOMContentLoaded", async () => {
	await ProfileManager.loadData();
});
