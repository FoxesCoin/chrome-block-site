import {
	createDateByTime,
	Daily,
	isWeekly,
	Timeline,
	Timer,
	Weekly,
} from "../utils";

const MILLISECOND_IN_DAY = 24 * 60 * 60 * 1000;

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
	const weekday = new Date().getDay();
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

export const isIncludesTodayInTimeline = (timeline: Timeline) =>
	isWeekly(timeline) ? isIncludeWeekly(timeline) : isIncludeDaily(timeline);
