import { dailyForm, weeklyForm } from "./utils";

const [weekly, daily] = Array.from(document.querySelectorAll(".tab__item"));

const ACTIVE_TAB = "tab__item_active";
const ACTIVE_FORM = "form_active";

const WEEK_TAB = { tab: weekly, form: weeklyForm };
const DAY_TAB = { tab: daily, form: dailyForm };

const toggleClass = (tab: any) => {
	tab.tab.classList.toggle(ACTIVE_TAB);
	tab.form.classList.toggle(ACTIVE_FORM);
};

const activeItem = (currentTab: any, otherTab: any) => {
	const classes = Array.from(currentTab.tab.classList);
	if (classes.includes(ACTIVE_TAB)) {
		return;
	}

	toggleClass(currentTab);
	toggleClass(otherTab);
};

weekly.addEventListener("click", () => {
	activeItem(WEEK_TAB, DAY_TAB);
});

daily.addEventListener("click", () => {
	activeItem(DAY_TAB, WEEK_TAB);
});
