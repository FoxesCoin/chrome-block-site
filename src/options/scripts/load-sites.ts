import { getSiteList, getTimelines, setSiteList, Timeline } from "../../utils";
import { addHtmlTimelines } from "./timeline";
import { siteList, timeline } from "./utils";

function removeSiteFromList(site: string) {
	getSiteList((sites) => {
		const newSites = sites.filter((item) => item !== site);
		siteList.innerHTML = "";
		newSites.forEach(addSiteToList);

		setSiteList(newSites);
	});
}

function addSiteToList(site: string) {
	const item = document.createElement("div");
	item.className = "site";

	const text = document.createElement("span");
	text.className = "site__text";
	text.innerHTML = site;

	const cross = document.createElement("img");
	cross.classList.add("site__cross");
	cross.src = "../assets/cross.svg";
	cross.alt = "Remove icon";

	cross.addEventListener("click", () => removeSiteFromList(site));

	item.appendChild(text);
	item.appendChild(cross);

	siteList.appendChild(item);
}

function loadTimelines(timelines: Timeline[]) {
	timeline.innerHTML = "";
	timelines.forEach(addHtmlTimelines);
}
function loadSites(sites: string[]) {
	siteList.innerHTML = "";
	sites.forEach(addSiteToList);
}

function loadData() {
	getTimelines(loadTimelines);
	getSiteList(loadSites);
}

chrome.storage.onChanged.addListener((data) => {
	if (data?.sites?.newValue) {
		loadSites(data.sites.newValue);
	}
	if (data?.timelines?.newValue) {
		loadTimelines(data.timelines.newValue);
	}
});

document.addEventListener("DOMContentLoaded", loadData);
