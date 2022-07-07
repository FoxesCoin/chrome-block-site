export type Nullable<T> = {
	[P in keyof T]: T[P] | null;
};

export interface Timer {
	start: string;
	end: string;
}

export interface Daily extends Timer {
	day: string;
	startDate: string;
}

export interface Weekly extends Timer {
	days: number[];
}

export type Timeline = Daily | Weekly;

export const isMatchDays = (first: number[], second: number[]) => {
	if (first.length !== second.length) return false;

	for (let index = 0; index < first.length; index++) {
		if (first[index] !== second[index]) return false;
	}

	return true;
};

export const isWeekly = (timeline: any): timeline is Weekly => !!timeline?.days;

const isEqualTime = (first: Timer, second: Timer): boolean =>
	first.start === second.start && second.end === first.end;

const isEqualWeekly = (first: Weekly, second: Weekly) => {
	const firstDays = first.days.sort();
	const secondDays = second.days.sort();
	return isEqualTime(first, second) && isMatchDays(firstDays, secondDays);
};
const isEqualDaily = (first: Daily, second: Daily) =>
	isEqualTime(first, second) && first.day === second.day;

const isExistWeeklyTimeline = (newTimeline: Weekly, oldTimelines: Timeline[]) =>
	oldTimelines.some(
		(timeline) => isWeekly(timeline) && isEqualWeekly(newTimeline, timeline)
	);

const isExistDailyTimeline = (newTimeline: Daily, oldTimelines: Timeline[]) =>
	oldTimelines.some(
		(timeline) => !isWeekly(timeline) && isEqualDaily(newTimeline, timeline)
	);

const isExistTimeline = (newTimeline: Timeline, oldTimelines: Timeline[]) =>
	isWeekly(newTimeline)
		? isExistWeeklyTimeline(newTimeline, oldTimelines)
		: isExistDailyTimeline(newTimeline, oldTimelines);

export const getSiteList = (getData: (sites: string[]) => void) => {
	chrome.storage.local.get("sites", (data) => {
		getData(data?.sites ?? []);
	});
};

export const setSiteList = (data: string[], callback?: () => void) => {
	chrome.storage.local.set(
		{
			sites: data,
		},
		callback
	);
};

export const getTimelines = (getData: (timelines: Timeline[]) => void) => {
	chrome.storage.local.get("timelines", (data) => {
		getData(data?.timelines ?? []);
	});
};

export const setTimelines = (data: Timeline[], callback?: () => void) => {
	chrome.storage.local.set(
		{
			timelines: data,
		},
		callback
	);
};

export function addTimeline(newTimeline: Timeline) {
	getTimelines((oldTimelines) => {
		if (isExistTimeline(newTimeline, oldTimelines)) {
			return alert("This timeline already exist!");
		}

		const newTimelines = [newTimeline, ...oldTimelines];
		setTimelines(newTimelines);
	});
}

export function removeTimeline(newTimeline: Timeline) {
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
