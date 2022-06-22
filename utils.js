const isMatchDays = (first, second) => {
	if (first.length !== second.length) return false;

	for (var i = 0; i < first.length; i++) {
		if (first[i] !== second[i]) return false;
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

const getSiteList = (getData) =>
	chrome.storage.sync.get("site_list", (data) => {
		getData(data?.site_list ?? []);
	});

const setSiteList = (data, callback) =>
	chrome.storage.sync.set(
		{
			site_list: data,
		},
		callback
	);

const getTimeline = (getData) =>
	chrome.storage.sync.get("timeline", (data) => {
		getData(data?.timeline ?? []);
	});

const setTimeline = (data, callback) =>
	chrome.storage.sync.set(
		{
			timeline: data,
		},
		callback
	);

const addTimeline = (newTimeline) =>
	getTimeline((oldTimelines) => {
		if (isExistTimeline(newTimeline, oldTimelines)) {
			return alert("This timeline already exist!");
		}

		const newTimelines = [newTimeline, ...oldTimelines];
		setTimeline(newTimelines);
	});

const removeTimeline = (newTimeline) =>
	getTimeline((oldTimelines) => {
		console.log();

		const newList = oldTimelines.filter((timeline) =>
			isWeekly(newTimeline)
				? isWeekly(timeline)
					? !isEqualWeekly(timeline, newTimeline)
					: true
				: isWeekly(timeline)
				? true
				: !isEqualDaily(timeline, newTimeline)
		);

		setTimeline(newList);
	});
