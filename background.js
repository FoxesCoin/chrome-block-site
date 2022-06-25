chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.get("sites", (data) => {
		if (Array.isArray(data?.sites)) {
			return;
		}

		chrome.storage.sync.set({
			sites: [],
		});
	});

	chrome.storage.sync.get("timelines", (data) => {
		if (Array.isArray(data?.timelines)) {
			return;
		}

		chrome.storage.sync.set({
			timelines: [],
		});
	});
});
