const isMatchDays = (first, second) => {
	if (first.length !== second.length) return false;

	for (let index = 0; index < first.length; index++) {
		if (first[index] !== second[index]) return false;
	}

	return true;
};

const isWeekly = (timeline) => !!timeline?.days;

const isEqualTime = (first, second) =>
	first.start === second.start && second.end === first.end;

const isEqualWeekly = (first, second) => {
	const firstDays = first.days.sort();
	const secondDays = second.days.sort();
	return isEqualTime(first, second) && isMatchDays(firstDays, secondDays);
};
const isEqualDaily = (first, second) =>
	isEqualTime(first, second) && first.day === second.day;

const isExistWeeklyTimeline = (newTimeline, oldTimelines) =>
	oldTimelines.some(
		(timeline) => isWeekly(timeline) && isEqualWeekly(newTimeline, timeline)
	);

const isExistDailyTimeline = (newTimeline, oldTimelines) =>
	oldTimelines.some(
		(timeline) => !isWeekly(timeline) && isEqualDaily(newTimeline, timeline)
	);

const isExistTimeline = (newTimeline, oldTimelines) =>
	isWeekly(newTimeline)
		? isExistWeeklyTimeline(newTimeline, oldTimelines)
		: isExistDailyTimeline(newTimeline, oldTimelines);

const getSiteList = (getData) => {
	chrome.storage.local.get("sites", (data) => {
		getData(data?.sites ?? []);
	});
};

const setSiteList = (data, callback) => {
	chrome.storage.local.set(
		{
			sites: data,
		},
		callback
	);
};

const getTimelines = (getData) => {
	chrome.storage.local.get("timelines", (data) => {
		getData(data?.timelines ?? []);
	});
};

const setTimelines = (data, callback) => {
	chrome.storage.local.set(
		{
			timelines: data,
		},
		callback
	);
};

function addTimeline(newTimeline) {
	getTimelines((oldTimelines) => {
		if (isExistTimeline(newTimeline, oldTimelines)) {
			return alert("This timeline already exist!");
		}

		const newTimelines = [newTimeline, ...oldTimelines];
		setTimelines(newTimelines);
	});
}

function removeTimeline(newTimeline) {
	getTimelines((oldTimelines) => {
		const newTimelines = oldTimelines.filter((timeline) =>
			isWeekly(newTimeline)
				? isWeekly(timeline)
					? !isEqualWeekly(timeline, newTimeline)
					: true
				: isWeekly(timeline)
				? true
				: !isEqualDaily(timeline, newTimeline)
		);

		setTimelines(newTimelines);
	});
}
