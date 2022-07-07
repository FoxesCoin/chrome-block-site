import { ProfileManager } from "../../profile";
import { ProfileData, Timeline } from "../../utils";
import { addHtmlTimelines } from "./timeline";
import { siteList, timeline } from "./utils";

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

	cross.addEventListener("click", () => ProfileManager.removeSite(site));

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

chrome.storage.onChanged.addListener((change) => {
	const id = ProfileManager.idProfile;
	const { timelines, sites } = change.profiles.newValue.find(
		(profile: ProfileData) => profile.id === id
	);
	loadTimelines(timelines);
	loadSites(sites);
});

document.addEventListener("DOMContentLoaded", async () => {
	await ProfileManager.loadData();
	const { sites, timelines } = ProfileManager.activeProfile;
	loadTimelines(timelines);
	loadSites(sites);
});
