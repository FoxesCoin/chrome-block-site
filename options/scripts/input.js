const input = document.getElementById("add-site__input");
const button = document.getElementById("add-site__button");
const errorMessage = document.querySelector(".add-site__error");

var urlRegExp =
	/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

function checkCurrentSite(callback) {
	const url = input.value.trim();

	getSiteList((sites) => {
		if (sites.some((site) => url.includes(site))) {
			errorMessage.innerHTML = "This site already added!";
			return;
		}

		callback(sites);
	});
}

function addNewSite() {
	const site = input.value.trim();

	if (!site) {
		return;
	}

	checkCurrentSite((currentSites) => {
		setSiteList([...currentSites, site], () => {
			input.value = "";
		});
	});
}

function validateNewSite(event) {
	const url = event.target.value?.trim();

	if (!urlRegExp.test(url)) {
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
