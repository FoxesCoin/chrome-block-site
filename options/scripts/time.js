const weeklyForm = document.getElementById("weekly-form");
const dailyForm = document.getElementById("daily-form");

const formSupport = (form) => {
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
	const data = new FormData(event.target);

	if (!data.getAll("day").length) {
		alert("You should select minimum one day!");
		event.preventDefault();
		return;
	}

	addTimeline({
		start: data.get("start"),
		end: data.get("end"),
		days: data.getAll("day"),
	});
});

dailyForm.addEventListener("submit", (event) => {
	const data = new FormData(event.target);

	addTimeline({
		start: data.get("start"),
		end: data.get("end"),
		day: data.get("day"),
		startDate: createToday(),
	});
});
