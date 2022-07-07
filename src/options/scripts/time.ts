import { addTimeline } from "./../../utils";
import { createDateByTime, createToday, dailyForm, weeklyForm } from "./utils";

const formSupport = (form: any) => {
	const start = form.querySelector(".time__start");
	const end = form.querySelector(".time__end");

	start.addEventListener("input", () => {
		const date = createDateByTime(start.value);
		date.setMinutes(date.getMinutes() + 1);

		end.setAttribute("min", `${date.getHours()}:${date.getMinutes()}`);
	});
};

formSupport(weeklyForm);
formSupport(dailyForm);

weeklyForm.addEventListener("submit", (event) => {
	event.preventDefault();
	if (!event.target) {
		return;
	}
	const data = new FormData(event.target as any);

	if (!data.getAll("day").length) {
		alert("You should select minimum one day!");
		return;
	}

	addTimeline({
		start: data.get("start"),
		end: data.get("end"),
		days: data.getAll("day"),
	});
	weeklyForm.reset();
});

dailyForm.addEventListener("submit", (event) => {
	event.preventDefault();
	if (!event.target) {
		return;
	}
	const data = new FormData(event.target as any);

	addTimeline({
		start: data.get("start"),
		end: data.get("end"),
		day: data.get("day"),
		startDate: createToday(),
	});
	dailyForm.reset();
});
