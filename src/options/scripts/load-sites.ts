import { getSiteList, getTimelines, setSiteList } from "../../utils";
import { addHtmlTimelines } from "./timeline";
import { siteList, timeline } from "./utils";

function removeSiteFromList(site: any) {
	getSiteList((sites: any) => {
		const newSites = sites.filter((item: any) => item !== site);
		siteList.innerHTML = "";
		newSites.forEach(addSiteToList);

		setSiteList(newSites);
	});
}

function addSiteToList(site: any) {
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

function loadTimelines(timelines: any) {
	timeline.innerHTML = "";
	timelines.forEach(addHtmlTimelines);
}
function loadSites(sites: any) {
	siteList.innerHTML = "";
	sites.forEach(addSiteToList);
}

function updateStorage(data: any) {
	if (data?.sites?.newValue) {
		loadSites(data.sites.newValue);
	}
	if (data?.timelines?.newValue) {
		loadTimelines(data.timelines.newValue);
	}
}

function loadData() {
	getTimelines(loadTimelines);
	getSiteList(loadSites);
}

chrome.storage.onChanged.addListener(updateStorage);

document.addEventListener("DOMContentLoaded", loadData);
