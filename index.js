const host = window.location.hostname;

const HTML = `<div class="message">Return to work</div>`;

const CSS = `<style>
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

const isWeekly = (timeline) => !!timeline?.days;
const isIncludeSite = (site_list) =>
	site_list.some((site) => host.includes(site));

function clearDocument() {
	document.body.innerHTML = HTML;
	document.head.innerHTML = CSS;
}

const createDateByTime = (time) => {
	const [hour, minute] = time.split(":");
	const date = new Date();
	date.setHours(+hour);
	date.setMinutes(+minute);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date;
};

const MILLISECOND_IN_MINUTE = 60 * 1000;
const MILLISECOND_IN_DAY = 24 * 60 * MILLISECOND_IN_MINUTE;
const diffDays = (first, second) => {
	var timeFirst = first.getTime();
	var timeSecond = second.getTime();

	return Math.floor((timeSecond - timeFirst) / MILLISECOND_IN_DAY);
};

const isTimeBetweenInterval = (timer) => {
	const start = createDateByTime(timer.start).getTime();
	const end = createDateByTime(timer.end).getTime();
	const todayTime = Date.now();

	return todayTime - start >= 0 && todayTime - end <= 0;
};

const isIncludeWeekly = (weekly) => {
	const today = new Date();
	const weekday = today.getDay();
	const isActiveDay = weekly.days.includes(weekday);

	return isActiveDay && isTimeBetweenInterval(weekly);
};

const isIncludeDaily = (daily) => {
	const today = new Date();
	const startDate = new Date(daily.startDate);

	const isActiveDay =
		+daily.day > 1 ? diffDays(startDate, today) % +daily.day === 0 : true;
	if (!isActiveDay) {
		return false;
	}

	return isTimeBetweenInterval(daily);
};

const isIncludesToday = (timeline) =>
	isWeekly(timeline) ? isIncludeWeekly(timeline) : isIncludeDaily(timeline);

function checkActiveTodayBlock(callback) {
	chrome.storage.sync.get("timeline", ({ timeline }) => {
		const isHaveActiveTimeline = timeline.some(isIncludesToday);
		callback(isHaveActiveTimeline);
	});
}
function checkSiteList(callback) {
	chrome.storage.sync.get("site_list", ({ site_list }) => {
		callback(isIncludeSite(site_list));
	});
}

const blockSiteByTime = () =>
	checkActiveTodayBlock((isActiveToday) => {
		if (isActiveToday) {
			clearDocument();
		}
	});

function loadDocument() {
	if (!document?.body) {
		return console.error("Too early!");
	}
	checkSiteList((isInclude) => {
		if (isInclude) {
			blockSiteByTime();
			setInterval(() => {
				blockSiteByTime();
			}, MILLISECOND_IN_MINUTE);
		}
	});
}

chrome.storage.onChanged.addListener((changes) => {
	const newSites = changes?.site_list?.newValue ?? [];
	const oldSites = changes?.site_list?.oldValue ?? [];
	const newTimelines = changes?.timeline?.newValue ?? [];
	const oldTimelines = changes?.timeline?.oldValue ?? [];

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
	if (newSites.length !== 0 && isIncludeSite(newSites)) {
		return blockSiteByTime();
	}
	if (oldSites.length !== 0 && isIncludeSite(oldSites)) {
		return location.reload();
	}
	if (oldTimelines.length > newTimelines.length) {
		checkActiveTodayBlock((isActiveToday) => {
			if (isActiveToday) {
				return;
			}
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
