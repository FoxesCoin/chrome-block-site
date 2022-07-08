import { ProfileManager } from "../../profile";
import { ProfileData } from "../../utils";
import { loadProfiles } from "./profile";
import { loadSites } from "./sites";
import { loadTimelines } from "./timeline";

chrome.storage.onChanged.addListener((change) => {
	const id = ProfileManager.idProfile;
	const { timelines, sites } = change.profiles.newValue.find(
		(profile: ProfileData) => profile.id === id
	);
	loadTimelines(timelines);
	loadSites(sites);
	loadProfiles(change.profiles.newValue);
});

document.addEventListener("DOMContentLoaded", async () => {
	await ProfileManager.loadData();
	const { sites, timelines } = ProfileManager.activeProfile;
	loadTimelines(timelines);
	loadSites(sites);
	loadProfiles(ProfileManager.profiles);
});
