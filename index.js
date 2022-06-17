const host = window.location.hostname;

const clearDocument = () => {
	chrome.storage.sync.get("site_list", ({ site_list }) => {
		if (site_list.some((site) => host.includes(site))) {
			document.body.innerHTML = `<div class="message">Return to work</div>`;
			document.head.innerHTML = `<style>
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
	</style>
	`;
		}
	});
};

const script = () => {
	clearDocument();

	chrome.storage.onChanged.addListener(() => {
		clearDocument();
	});
};

document.addEventListener("DOMContentLoaded", script);
