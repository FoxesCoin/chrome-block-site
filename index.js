const host = window.location.hostname;

const HTML = `<div class="message">Return to work</div>`;

const CSS = `<style>
.message {
	display: flex;
	justify-content: center;
	align-items: center;

	color: white;
	font-size: 4rem;
	font-weight: bold;
	background-color: black;

	position: fixed;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
}
</style>`;

const isIncludeSite = (site_list) =>
	site_list.some((site) => host.includes(site));

function clearDocument() {
	if (!document?.body) {
		return console.error("Too early!");
	}
	chrome.storage.sync.get("site_list", ({ site_list }) => {
		if (isIncludeSite(site_list)) {
			document.body.innerHTML = HTML;
			document.head.innerHTML = CSS;
		}
	});
}

chrome.storage.onChanged.addListener((changes) => {
	const list = changes?.site_list?.newValue ?? [];

	console.log(list);

	if (isIncludeSite(list)) {
		return clearDocument();
	}
	location.reload();
});

document.addEventListener("DOMContentLoaded", clearDocument);
