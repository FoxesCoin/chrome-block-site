chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.get("site_list", (data) => {
		if (Array.isArray(data.site_list)) {
			return;
		}

		chrome.storage.sync.set({
			site_list: [],
		});
	});

	chrome.storage.sync.get("timeline", (data) => {
		if (Array.isArray(data.timeline)) {
			return;
		}

		chrome.storage.sync.set({
			timeline: [],
		});
	});
});
