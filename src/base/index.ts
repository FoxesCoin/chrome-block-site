import { getProfiles, getUpdatedProfile } from "../utils";
import { BlockSiteManager, isExistSite } from "./block-site";
import { isIncludesTodayInTimeline } from "./timeline";

async function loadDocument() {
	if (!document?.body) {
		return console.error("Too early!");
	}

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

	const { newProfile, oldProfile } = getUpdatedProfile(newValue, oldValue);

	//? Did profile REMOVE?
	if (!newProfile) {
		if (BlockSiteManager.isIncludeSite) {
			location.reload();
		}

		return;
	}

	//? Did profile UPDATE?

	const { sites: newSites, timelines: newTimelines } = newProfile;
	const { sites: oldSites, timelines: oldTimelines } = oldProfile!;

	const isHaveActiveTodayBlock = BlockSiteManager.checkProfiles(newValue);

	if (isHaveActiveTodayBlock) {
		return;
	}

	//? Did you REMOVE SITE?
	if (oldSites.length > newSites.length && isExistSite(oldSites)) {
		return location.reload();
	}

	//? Did you REMOVED TIMELINE?
	if (oldTimelines.length > newTimelines.length) {
		//? Are we have active block now?
		if (BlockSiteManager.isHaveActiveTimeline) {
			return;
		}
		//? Did the removed timeline have a block?
		const isHaveActiveTimeline = oldTimelines.some(isIncludesTodayInTimeline);
		if (!isHaveActiveTimeline) {
			return;
		}
		if (BlockSiteManager.isIncludeSite) {
			location.reload();
		}
	}
});

document.addEventListener("DOMContentLoaded", loadDocument);
