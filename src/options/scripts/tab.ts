import { dailyForm, weeklyForm } from "./utils";

interface Tab {
	tab: HTMLElement;
	form: HTMLFormElement;
}

const [weekly, daily] = Array.from(document.querySelectorAll(".tab__item"));

const ACTIVE_TAB = "tab__item_active";
const ACTIVE_FORM = "form_active";

const WEEK_TAB: Tab = { tab: weekly, form: weeklyForm };
const DAY_TAB: Tab = { tab: daily, form: dailyForm };

const toggleClass = (tab: Tab) => {
	tab.tab.classList.toggle(ACTIVE_TAB);
	tab.form.classList.toggle(ACTIVE_FORM);
};

const activeItem = (currentTab: Tab, otherTab: Tab) => {
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
