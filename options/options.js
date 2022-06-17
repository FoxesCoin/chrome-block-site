let list = document.getElementById("site-list");

const parseSites = () => {
	chrome.storage.sync.get("site_list", (result) => {
		result?.site_list?.forEach(addSite);
	});
};

const removeSiteFromList = (site) => {
	chrome.storage.sync.get("site_list", (result) => {
		const newSites = result?.site_list?.filter((item) => item !== site);
		list.innerHTML = "";
		newSites.forEach(addSite);

		chrome.storage.sync.set({ site_list: newSites });
	});
};

const addSite = (site) => {
	const item = document.createElement("div");
	item.className = "site";

	const text = document.createElement("span");
	text.className = "site__text";
	text.innerHTML = site;

	const cross = document.createElement("img");
	cross.classList = "site__cross";
	cross.src = "icon/cross.svg";
	cross.alt = "Remove icon";

	cross.addEventListener("click", () => removeSiteFromList(site));

	item.appendChild(text);
	item.appendChild(cross);

	list.appendChild(item);
};

chrome.storage.onChanged.addListener(() => {
	parseSites();
});

parseSites();
