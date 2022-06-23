const WEEK_DAYS = [
	{ value: 0, letter: "M" },
	{ value: 1, letter: "T" },
	{ value: 2, letter: "W" },
	{ value: 3, letter: "T" },
	{ value: 4, letter: "F" },
	{ value: 5, letter: "S" },
	{ value: 6, letter: "S" },
];

function createTime(time) {
	const timer = document.createElement("span");
	timer.className = "timeline__time";
	timer.innerHTML = time;

	return timer;
}

function createTimer(time) {
	const { start, end } = time;

	const timer = document.createElement("div");
	timer.classList = "timeline__timer";

	const separator = document.createElement("span");
	separator.classList = "title";
	separator.innerHTML = "to";

	const startTime = createTime(start);
	const endTime = createTime(end);

	timer.appendChild(startTime);
	timer.appendChild(separator);
	timer.appendChild(endTime);

	return timer;
}

function createWeeklyTimeline(weekdays) {
	const days = document.createElement("div");
	days.className = "timeline__weekdays";

	WEEK_DAYS.forEach(({ value, letter }) => {
		const day = document.createElement("span");
		const isActive = weekdays.some((day) => +day === value);
		day.className = `timeline__day ${isActive ? "timeline__day_active" : ""}`;
		day.innerHTML = letter;
		days.appendChild(day);
	});

	return days;
}

function createWeekly(time) {
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

function createDaily(time) {
	const item = document.createElement("div");
	item.className = "timeline";

	const title = document.createElement("span");
	title.className = "title";
	title.innerHTML = "Daily";

	const days = document.createElement("span");
	days.className = "timeline__daily";
	days.innerHTML = `repeat ${time.day > 1 ? `every ${time.day}` : "everyday"}`;

	item.appendChild(title);
	item.appendChild(days);

	return item;
}

function addTime(time) {
	const item = time.days ? createWeekly(time) : createDaily(time);

	const timer = createTimer(time);
	const cross = document.createElement("img");
	cross.classList = "site__cross";
	cross.src = "icon/cross.svg";
	cross.alt = "Remove icon";

	cross.addEventListener("click", () => removeTimeline(time));
	item.appendChild(timer);
	item.appendChild(cross);

	timeline.appendChild(item);
}
