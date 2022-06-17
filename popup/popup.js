let button = document.getElementById("submit");

const startRegExp = /https:\/\/|http:\/\/|www./g;

const clearUrl = (link) => {
	const newLink = link.replace(startRegExp, "");
	return newLink.substring(0, newLink.indexOf("/"));
};

const disabledButton = (message) => {
	button.setAttribute("disabled", "");
	button.innerHTML = message;
};

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	const url = clearUrl(tabs[0].url);

	button.addEventListener("click", () => {
		chrome.storage.sync.get("site_list", (result) => {
			if (result.site_list.some((item) => url.includes(item))) {
				return;
			}
			chrome.storage.sync.set({ site_list: [...result.site_list, url] }, () => {
				disabledButton("Completed!");
			});
		});
	});

	chrome.storage.sync.get("site_list", ({ site_list }) => {
		if (site_list.some((site) => url.includes(site))) {
			disabledButton("Already added!");
		}
	});
});
