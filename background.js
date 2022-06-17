chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.get("site_list", (data) => {
		if (Array.isArray(data.site_list)) {
			return;
		}

		chrome.storage.sync.set({
			site_list: [],
		});
	});
});
