import { ProfileData, Timeline } from "../utils";
import { isIncludesTodayInTimeline } from "./timeline";

const HOST = window.location.hostname;
const URL =
	"chrome-extension://gegfekkmkeefhonpmckhmdaalebkhkjo/block-site-redirect.html";
const MILLISECOND_IN_MINUTE = 60 * 1000;

export const isExistSite = (sites: string[]) =>
	sites.some((site) => HOST.includes(site));

class BlockSite {
	#connectedTimelines: Timeline[][] = [];
	#intervalId: any;

	#blockSiteByTime() {
		window.location.href = URL;
	}

	#activateSiteTimer = () => {
		this.#blockSiteByTime();
		if (this.#intervalId) {
			clearInterval(this.#intervalId);
		}
		this.#intervalId = setInterval(() => {
			this.#blockSiteByTime();
		}, MILLISECOND_IN_MINUTE);
	};

	#setIsHaveActiveTimeline(newValue: boolean) {
		if (newValue) {
			return this.#activateSiteTimer();
		}
		if (this.#intervalId) {
			clearInterval(this.#intervalId);
			this.#intervalId = undefined;
		}
	}

	#isHaveTodayBlock() {
		return this.#connectedTimelines.some(
			(timelines) =>
				!timelines.length || timelines.some(isIncludesTodayInTimeline)
		);
	}

	checkProfiles(profiles: ProfileData[]) {
		const timelines = profiles
			.filter((profile) => isExistSite(profile.sites))
			.map(({ timelines }) => timelines);

		this.#connectedTimelines = timelines;
		this.#setIsHaveActiveTimeline(
			timelines.length > 0 && this.#isHaveTodayBlock()
		);
	}
}

export const BlockSiteManager = new BlockSite();
