export const isMatchDays = (first: any, second: any) => {
	if (first.length !== second.length) return false;

	for (let index = 0; index < first.length; index++) {
		if (first[index] !== second[index]) return false;
	}

	return true;
};

export const isWeekly = (timeline: any) => !!timeline?.days;

export const isEqualTime = (first: any, second: any) =>
	first.start === second.start && second.end === first.end;

export const isEqualWeekly = (first: any, second: any) => {
	const firstDays = first.days.sort();
	const secondDays = second.days.sort();
	return isEqualTime(first, second) && isMatchDays(firstDays, secondDays);
};
export const isEqualDaily = (first: any, second: any) =>
	isEqualTime(first, second) && first.day === second.day;

export const isExistWeeklyTimeline = (newTimeline: any, oldTimelines: any) =>
	oldTimelines.some(
		(timeline: any) =>
			isWeekly(timeline) && isEqualWeekly(newTimeline, timeline)
	);

export const isExistDailyTimeline = (newTimeline: any, oldTimelines: any) =>
	oldTimelines.some(
		(timeline: any) =>
			!isWeekly(timeline) && isEqualDaily(newTimeline, timeline)
	);

export const isExistTimeline = (newTimeline: any, oldTimelines: any) =>
	isWeekly(newTimeline)
		? isExistWeeklyTimeline(newTimeline, oldTimelines)
		: isExistDailyTimeline(newTimeline, oldTimelines);

export const getSiteList = (getData: any) => {
	chrome.storage.local.get("sites", (data) => {
		getData(data?.sites ?? []);
	});
};

export const setSiteList = (data: any, callback?: any) => {
	chrome.storage.local.set(
		{
			sites: data,
		},
		callback
	);
};

export const getTimelines = (getData: any) => {
	chrome.storage.local.get("timelines", (data) => {
		getData(data?.timelines ?? []);
	});
};

export const setTimelines = (data: any, callback?: any) => {
	chrome.storage.local.set(
		{
			timelines: data,
		},
		callback
	);
};

export function addTimeline(newTimeline: any) {
	getTimelines((oldTimelines: any) => {
		if (isExistTimeline(newTimeline, oldTimelines)) {
			return alert("This timeline already exist!");
		}

		const newTimelines = [newTimeline, ...oldTimelines];
		setTimelines(newTimelines);
	});
}

export function removeTimeline(newTimeline: any) {
	getTimelines((oldTimelines: any) => {
		const newTimelines = oldTimelines.filter((timeline: any) =>
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
