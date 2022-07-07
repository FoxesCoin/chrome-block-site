import { ProfileManager } from "../../profile";

const input = document.getElementById("add-site__input")! as HTMLInputElement;
const button = document.getElementById("add-site__button")!;
const errorMessage = document.querySelector(".add-site__error")!;

const URL_REGEXP =
	/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i;

function checkCurrentSite(callback: (sites: string[]) => void) {
	const url = input?.value?.trim();

	const sites = ProfileManager.activeProfile?.sites;

	if (!sites) {
		return;
	}

	if (sites.some((site) => url.includes(site))) {
		errorMessage.innerHTML = "This site already added!";
		return;
	}

	callback(sites);
}

async function addNewSite() {
	const site = input.value.trim();

	if (!site) {
		return;
	}

	await ProfileManager.addSite(site);
	input.value = "";
}

function validateNewSite(event: any) {
	const url = event.target.value?.trim();

	if (!URL_REGEXP.test(url)) {
		errorMessage.innerHTML = "Invalid URL!";
		button.setAttribute("disabled", "");
		return;
	}

	checkCurrentSite(() => {
		errorMessage.innerHTML = "";
		button.removeAttribute("disabled");
	});
}

button.addEventListener("click", addNewSite);
input.addEventListener("input", validateNewSite);
