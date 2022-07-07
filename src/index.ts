import { Daily, isWeekly, Timeline, Timer, Weekly } from "./utils";

const HOST = window.location.hostname;

const MILLISECOND_IN_MINUTE = 60 * 1000;
const MILLISECOND_IN_DAY = 24 * 60 * MILLISECOND_IN_MINUTE;

const HTML = `<div class="message">Return to work</div>`;
const HEADER = `<style>
.message {
	display: flex;
	justify-content: center;
	align-items: center;

	color: #fff;
	font-size: 4rem;
	font-weight: bold;
	background-color: #000;

	position: fixed;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
}
</style>`;

const isIncludeSite = (sites: string[]) =>
	sites.some((site) => HOST.includes(site));

function clearDocument() {
	document.body.innerHTML = HTML;
	document.head.innerHTML = HEADER;
}

const createDateByTime = (time: string) => {
	const [hour, minute] = time.split(":");
	const date = new Date();
	date.setHours(+hour);
	date.setMinutes(+minute);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date;
};

const diffDays = (first: Date, second: Date) => {
	var timeFirst = first.getTime();
	var timeSecond = second.getTime();

	return Math.floor((timeSecond - timeFirst) / MILLISECOND_IN_DAY);
};

const isTimeBetweenInterval = (timer: Timer) => {
	const start = createDateByTime(timer.start).getTime();
	const end = createDateByTime(timer.end).getTime();
	const todayTime = Date.now();

	return todayTime - start >= 0 && todayTime - end <= 0;
};

const isIncludeWeekly = (weekly: Weekly) => {
	const today = new Date();
	const weekday = today.getDay();
	const isActiveDay = weekly.days.some((day) => day === weekday);

	return isActiveDay && isTimeBetweenInterval(weekly);
};

const isIncludeDaily = (daily: Daily) => {
	const today = new Date();
	const startDate = new Date(daily.startDate);
	const day = +daily.day;

	const isActiveDay = day > 1 ? diffDays(startDate, today) % day === 0 : true;

	return isActiveDay && isTimeBetweenInterval(daily);
};

const isIncludesToday = (timeline: Timeline) =>
	isWeekly(timeline) ? isIncludeWeekly(timeline) : isIncludeDaily(timeline);

function checkActiveTodayBlock(
	callback: (isHaveActiveTimeline: boolean) => void
) {
	chrome.storage.local.get("timelines", (data) => {
		const timelines = data?.timelines;
		//* If we don't have any active timeline then block site.
		const isHaveActiveTimeline = !!timelines?.length
			? timelines.some(isIncludesToday)
			: true;
		callback(isHaveActiveTimeline);
	});
}

function checkSiteList(callback: (isIncludeSite: boolean) => void) {
	chrome.storage.local.get("sites", ({ sites }) => {
		callback(isIncludeSite(sites));
	});
}

function blockSiteByTime() {
	checkActiveTodayBlock((isActiveToday) => {
		if (isActiveToday) {
			clearDocument();
		}
	});
}

let intervalId: any;
const activateSiteTimer = () => {
	blockSiteByTime();
	if (intervalId) {
		clearInterval(intervalId);
	}
	intervalId = setInterval(() => {
		blockSiteByTime();
	}, MILLISECOND_IN_MINUTE);
};

function loadDocument() {
	if (!document?.body) {
		return console.error("Too early!");
	}
	checkSiteList((isInclude) => {
		if (isInclude) {
			activateSiteTimer();
		}
	});
}

chrome.storage.onChanged.addListener((changes) => {
	const newSites = changes?.sites?.newValue ?? [];
	const oldSites = changes?.sites?.oldValue ?? [];
	const newTimelines = changes?.timelines?.newValue ?? [];
	const oldTimelines = changes?.timelines?.oldValue ?? [];

	//? Is all timelines remove? Then block all sites
	if (newTimelines.length === 0 && oldTimelines.length > 0) {
		checkSiteList((isInclude) => {
			if (isInclude) {
				clearDocument();
			}
		});
	}

	//? Is the new timeline active now?
	if (newTimelines.length > oldTimelines.length) {
		if (!isIncludesToday(newTimelines[0])) {
			return;
		}
		checkSiteList((isInclude) => {
			if (isInclude) {
				clearDocument();
			}
		});

		return;
	}
	//? Did you add this site?
	if (newSites.length > oldSites.length && isIncludeSite(newSites)) {
		return activateSiteTimer();
	}
	//? Did you remove this site?
	if (oldSites.length > newSites.length && isIncludeSite(oldSites)) {
		return location.reload();
	}
	//? Is it removed timeline?
	if (oldTimelines.length > newTimelines.length) {
		checkActiveTodayBlock((isActiveToday) => {
			//? Are we have  active block now?
			if (isActiveToday) {
				return;
			}
			//? Did the removed timeline have a block?
			const isHaveActiveTimeline = oldTimelines.some(isIncludesToday);
			if (!isHaveActiveTimeline) {
				return;
			}
			checkSiteList((isInclude) => {
				if (isInclude) {
					location.reload();
				}
			});
		});
	}
});

document.addEventListener("DOMContentLoaded", loadDocument);
