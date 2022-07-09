import { getProfiles, getUpdatedProfile } from "../utils";
import { BlockSiteManager, isExistSite } from "./block-site";
import { isIncludesTodayInTimeline } from "./timeline";

// const MILLISECOND_IN_MINUTE = 60 * 1000;

// function checkActiveTodayBlock(
// 	callback: (isHaveActiveTimeline: boolean) => void
// ) {
// 	// chrome.storage.local.get("timelines", (data) => {
// 	// 	const timelines = data?.timelines;
// 	// 	//* If we don't have any active timeline then block site.
// 	// 	const isHaveActiveTimeline = !!timelines?.length
// 	// 		? timelines.some(isIncludesToday)
// 	// 		: true;
// 	// 	callback(isHaveActiveTimeline);
// 	// });
// }

// function checkSiteList(callback: (isIncludeSite: boolean) => void) {
// 	// chrome.storage.local.get("sites", ({ sites }) => {
// 	// 	callback(isIncludeSite(sites));
// 	// });
// }

// function blockSiteByTime() {
// 	checkActiveTodayBlock((isActiveToday) => {
// 		if (isActiveToday) {
// 			clearDocument();
// 		}
// 	});
// }

// let intervalId: any;
// const activateSiteTimer = () => {
// 	blockSiteByTime();
// 	if (intervalId) {
// 		clearInterval(intervalId);
// 	}
// 	intervalId = setInterval(() => {
// 		blockSiteByTime();
// 	}, MILLISECOND_IN_MINUTE);
// };

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
	if (!newValue) {
		return;
	}

	//? Did added new profile
	if (newValue.length > changes.profiles.oldValue.length) {
		return;
	}

	const { newProfile, oldProfile } = getUpdatedProfile(
		newValue,
		changes.profiles.oldValue
	);

	const { sites: newSites, timelines: newTimelines } = newProfile;
	const { sites: oldSites, timelines: oldTimelines } = oldProfile;

	const isHaveActiveTodayBlock = BlockSiteManager.checkProfiles(newValue);

	if (isHaveActiveTodayBlock) {
		return;
	}

	//? Did you remove this site?
	if (oldSites.length > newSites.length && isExistSite(oldSites)) {
		return location.reload();
	}

	//? Is it removed timeline?
	if (oldTimelines.length > newTimelines.length) {
		const isActiveToday = BlockSiteManager.isHaveActiveTimeline;
		//? Are we have  active block now?
		if (isActiveToday) {
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

	location.reload();
});

document.addEventListener("DOMContentLoaded", loadDocument);
