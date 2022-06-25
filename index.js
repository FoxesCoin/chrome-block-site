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
const isIncludeSite = (sites) => sites.some((site) => host.includes(site));

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
	chrome.storage.sync.get("timelines", ({ timelines }) => {
		const isHaveActiveTimeline = timelines?.some(isIncludesToday) ?? false;
		callback(isHaveActiveTimeline);
	});
}

function checkSiteList(callback) {
	chrome.storage.sync.get("sites", ({ sites }) => {
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
	const newSites = changes?.sites?.newValue ?? [];
	const oldSites = changes?.sites?.oldValue ?? [];
	const newTimelines = changes?.timeline?.newValue ?? [];
	const oldTimelines = changes?.timeline?.oldValue ?? [];

	// Is the new timeline active now?
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
	// Did you add this site?
	if (newSites.length > oldSites.length && isIncludeSite(newSites)) {
		return blockSiteByTime();
	}
	//Did you remove this site?
	if (oldSites.length > newSites.length && isIncludeSite(oldSites)) {
		return location.reload();
	}
	// Is it removed timeline?
	if (oldTimelines.length > newTimelines.length) {
		checkActiveTodayBlock((isActiveToday) => {
			// Are we have  active block now?
			if (isActiveToday) {
				return;
			}
			// Did the removed timeline have a block?
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
