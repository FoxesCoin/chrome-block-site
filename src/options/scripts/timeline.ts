import {
	Daily,
	isWeekly,
	removeTimeline,
	Timeline,
	Timer,
	Weekly,
} from "../../utils";
import { timeline as timelinesList } from "./utils";

const WEEK_DAYS = [
	{ value: 0, letter: "M" },
	{ value: 1, letter: "T" },
	{ value: 2, letter: "W" },
	{ value: 3, letter: "T" },
	{ value: 4, letter: "F" },
	{ value: 5, letter: "S" },
	{ value: 6, letter: "S" },
];

function createTime(time: string) {
	const timer = document.createElement("span");
	timer.className = "timeline__time";
	timer.innerHTML = time;

	return timer;
}

function createTimer(time: Timer) {
	const { start, end } = time;

	const timer = document.createElement("div")!;
	timer.classList.add("timeline__timer");

	const separator = document.createElement("span");
	separator.classList.add("title");
	separator.innerHTML = "to";

	const startTime = createTime(start);
	const endTime = createTime(end);

	timer.appendChild(startTime);
	timer.appendChild(separator);
	timer.appendChild(endTime);

	return timer;
}

function createWeeklyTimeline(weekdays: number[]) {
	const days = document.createElement("div");
	days.className = "timeline__weekdays";

	WEEK_DAYS.forEach(({ value, letter }) => {
		const day = document.createElement("span");
		const isActive = weekdays.some((day) => day === value);
		day.className = `timeline__day ${isActive ? "timeline__day_active" : ""}`;
		day.innerHTML = letter;
		days.appendChild(day);
	});

	return days;
}

function createWeekly(time: Weekly) {
	const item = document.createElement("div");
	item.className = "timeline";

	const title = document.createElement("span");
	title.className = "title";
	title.innerHTML = "Weekly";

	const weeklyTimeline = createWeeklyTimeline(time.days);

	item.appendChild(title);
	item.appendChild(weeklyTimeline);

	return item;
}

function createDaily(time: Daily) {
	const item = document.createElement("div");
	item.className = "timeline";

	const title = document.createElement("span");
	title.className = "title";
	title.innerHTML = "Daily";

	const days = document.createElement("span");
	days.className = "timeline__daily";
	days.innerHTML = `repeat ${+time.day > 1 ? `every ${time.day}` : "everyday"}`;

	item.appendChild(title);
	item.appendChild(days);

	return item;
}

export function addHtmlTimelines(timeline: Timeline) {
	const item = isWeekly(timeline)
		? createWeekly(timeline)
		: createDaily(timeline);

	const timer = createTimer(timeline);
	const cross = document.createElement("img");
	cross.classList.add("site__cross");
	cross.src = "../assets/cross.svg";
	cross.alt = "Remove icon";

	cross.addEventListener("click", () => removeTimeline(timeline));
	item.appendChild(timer);
	item.appendChild(cross);

	timelinesList.appendChild(item);
}
