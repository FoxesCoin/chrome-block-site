import { ProfileData, Timeline } from "../utils";
import { clearDocument } from "./clear-document";
import { isIncludesTodayInTimeline } from "./timeline";

const HOST = window.location.hostname;
const MILLISECOND_IN_MINUTE = 60 * 1000;

export const isExistSite = (sites: string[]) =>
	sites.some((site) => HOST.includes(site));

class BlockSite {
	#isHaveActiveTimeline = false;
	#isIncludeSite = false;
	#connectedTimelines: Timeline[] = [];
	#intervalId: any;

	#setIsHaveActiveTimeline(newValue: boolean) {
		if (newValue === this.#isHaveActiveTimeline) {
			return;
		}
		this.#isHaveActiveTimeline = newValue;
		if (newValue) {
			return this.activateSiteTimer();
		}
		if (this.#intervalId) {
			clearInterval(this.#intervalId);
			this.#intervalId = null;
		}
	}

	#isHaveTodayBlock() {
		return this.#connectedTimelines.some((timelines) =>
			isIncludesTodayInTimeline(timelines)
		);
	}

	#blockSiteByTime() {
		if (this.isHaveActiveTimeline) {
			clearDocument();
		}
	}

	get isIncludeSite() {
		return this.#isIncludeSite;
	}
	get isHaveActiveTimeline() {
		return this.#isHaveActiveTimeline;
	}

	checkProfiles(profiles: ProfileData[]): boolean {
		const timelines = profiles
			.filter((profile) => isExistSite(profile.sites))
			.map(({ timelines }) => timelines);

		this.#isIncludeSite = !!timelines.length;
		this.#setIsHaveActiveTimeline(
			(timelines.length > 0 &&
				timelines.some((timelines) => !timelines.length)) ||
				this.#isHaveTodayBlock()
		);

		return this.#isHaveActiveTimeline;
	}

	activateSiteTimer = () => {
		this.#blockSiteByTime();
		if (this.#intervalId) {
			clearInterval(this.#intervalId);
		}
		this.#intervalId = setInterval(() => {
			this.#blockSiteByTime();
		}, MILLISECOND_IN_MINUTE);
	};
}

export const BlockSiteManager = new BlockSite();
