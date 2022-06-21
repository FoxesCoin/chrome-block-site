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

const updateTimeline = (update) =>
	getTimeline((oldTimeline) => {
		const newTimeline = update(oldTimeline);
		setTimeline(newTimeline);
	});
