const [weekly, daily] = Array.from(document.querySelectorAll(".tab__item"));

const ACTIVE_TAB = "tab__item_active";
const ACTIVE_FORM = "form_active";

const toggleClass = (tab) => {
	tab.tab.classList.toggle(ACTIVE_TAB);
	tab.form.classList.toggle(ACTIVE_FORM);
};

const activeItem = (currentTab, otherTab) => {
	const classes = Array.from(currentTab.tab.classList);
	if (classes.includes(ACTIVE_TAB)) {
		return;
	}

	toggleClass(currentTab);
	toggleClass(otherTab);
};

weekly.addEventListener("click", () => {
	activeItem(
		{ tab: weekly, form: weeklyForm },
		{ tab: daily, form: dailyForm }
	);
});

daily.addEventListener("click", () => {
	activeItem(
		{ tab: daily, form: dailyForm },
		{ tab: weekly, form: weeklyForm }
	);
});
