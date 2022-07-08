import { ProfileManager } from "./profile";

const siteList = document.getElementById("site-list")!;

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

export function loadSites(sites: string[]) {
	siteList.innerHTML = "";
	sites.forEach(addSiteToList);
}
