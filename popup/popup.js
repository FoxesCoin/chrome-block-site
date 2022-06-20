const startRegExp = /https?:\/\/|www\./;

const button = document.getElementById("submit");

let url;

const clearUrl = (link) => {
	const newLink = link.replace(startRegExp, "");
	const index = newLink.indexOf("/");
	if (index !== -1) {
		return newLink.substring(0, newLink.indexOf("/"));
	}
	return newLink;
};

const isIncludeSite = (site_list = []) =>
	site_list.some((site) => url.includes(site));

function disabledButton(message) {
	button.setAttribute("disabled", "");
	button.innerHTML = message;
}

function activeButton(message) {
	button.removeAttribute("disabled");
	button.innerHTML = message;
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	url = clearUrl(tabs[0].url);

	button.addEventListener("click", () => {
		chrome.storage.sync.get("site_list", (result) => {
			if (isIncludeSite(result?.site_list)) {
				return;
			}
			chrome.storage.sync.set({ site_list: [...result.site_list, url] }, () => {
				disabledButton("Completed!");
			});
		});
	});
});

chrome.storage.sync.get("site_list", ({ site_list }) => {
	if (site_list.some((site) => url.includes(site))) {
		disabledButton("Already added!");
	}
});

chrome.storage.onChanged.addListener((changes) => {
	const list = changes?.site_list?.newValue;
	if (isIncludeSite(list)) {
		return disabledButton("Already added!");
	}
	activeButton("Add this site.");
});
