import { ProfileData } from "./utils";

const PROFILE_TEMPLATE: ProfileData = {
	id: 1,
	sites: [],
	timelines: [],
};

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.set({
		profiles: [PROFILE_TEMPLATE],
	});
});
