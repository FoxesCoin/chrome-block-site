import { ProfileManager } from "./profile";
import { isIncludeSite } from "./url";

const button = document.getElementById("add-site")!;

function disabledButton(message: string) {
	button.setAttribute("disabled", "");
	button.innerHTML = message;
}

function activeButton(message: string) {
	button.removeAttribute("disabled");
	button.innerHTML = message;
}

export function toggleButton(sites: string[]) {
	if (isIncludeSite(sites)) {
		return disabledButton("Already added!");
	}
	activeButton("Add this site.");
}

button.addEventListener("click", async () => {
	const sites = ProfileManager.activeProfile.sites;
	if (isIncludeSite(sites)) {
		return;
	}
	await ProfileManager.addSite();
	disabledButton("Completed!");
});

document.addEventListener("DOMContentLoaded", () => {
	const sites = ProfileManager.activeProfile.sites;
	toggleButton(sites);
});
