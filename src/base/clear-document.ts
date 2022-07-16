const HTML = `<div class="message">
Return to work
</div>`;
const HEADER = `<style>
.message {
	display: flex;
	justify-content: center;
	align-items: center;

	color: #fff;
	font-size: 4rem;
	font-weight: bold;
	background-color: #000;

	position: fixed;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
}
</style>`;

export function clearDocument() {
	location.href =
		"chrome-extension://gegfekkmkeefhonpmckhmdaalebkhkjo/block-site-redirect.html";
}
