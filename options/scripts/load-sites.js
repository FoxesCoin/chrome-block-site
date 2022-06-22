const siteList = document.getElementById("site-list");
const timeline = document.getElementById("timeline");

function removeSiteFromList(site) {
	getSiteList((sites) => {
		const newSites = sites.filter((item) => item !== site);
		siteList.innerHTML = "";
		newSites.forEach(addSiteToList);

		setSiteList(newSites);
	});
}

function addSiteToList(site) {
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

	siteList.appendChild(item);
}

function updateStorage(data) {
	if (data?.site_list) {
		getSiteList((sites) => {
			siteList.innerHTML = "";
			sites.forEach(addSiteToList);
		});
	}
	if (data?.timeline) {
		getTimeline((timeline_data) => {
			timeline.innerHTML = "";
			timeline_data.forEach(addTime);
		});
	}
}

function loadData(data) {
	getSiteList((sites) => {
		siteList.innerHTML = "";
		sites.forEach(addSiteToList);
	});
	getTimeline((timeline_data) => {
		timeline.innerHTML = "";
		timeline_data.forEach(addTime);
	});
}

chrome.storage.onChanged.addListener(updateStorage);

loadData();
