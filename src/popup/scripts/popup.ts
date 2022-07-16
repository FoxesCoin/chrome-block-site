import "../popup.scss";

import { toggleButton } from "./add-site-button";
import { ProfileManager } from "./profile";

chrome.storage.onChanged.addListener((change) => {
	const newValue = change?.profiles?.newValue;
	if (!newValue) {
		return;
	}

	ProfileManager.getNewProfiles(newValue);
	const { sites } = ProfileManager.activeProfile;
	toggleButton(sites);
});
