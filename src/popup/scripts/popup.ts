import "../popup.scss";

import { toggleButton } from "./add-site-button";
import { ProfileManager } from "./profile";

// TODO update to profile functional
chrome.storage.onChanged.addListener((change) => {
	const newValue = change?.profiles?.newValue;
	if (!newValue) {
		return;
	}

	ProfileManager.getNewProfiles(newValue);
	const { sites } = ProfileManager.activeProfile;
	toggleButton(sites);
});
