import { NotNullable, Nullable, Omit } from "../../types";
import { createDateByTime, Daily, Weekly } from "../../utils";
import { ProfileManager } from "./profile";
import { createToday, dailyForm, weeklyForm } from "./utils";

const formSupport = (form: HTMLFormElement) => {
	const start = form.querySelector(".time__start") as HTMLInputElement;
	const end = form.querySelector(".time__end") as HTMLInputElement;

	if (!start || !end) {
		return console.error("Form element not found");
	}

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

	const data = new FormData(event.target as HTMLFormElement);
	const days = data.getAll("day").map((day) => +day);

	if (!days.length) {
		return alert("You should select minimum one day!");
	}

	const time = {
		start: data.get("start"),
		end: data.get("end"),
	};

	if (!time.start || !time.end) {
		throw new Error("Time not found");
	}

	ProfileManager.addTimeline({ days, ...time } as Weekly);
	weeklyForm.reset();
});

type DailyFormData = Nullable<Omit<Daily, "startDate">>;
type DailyFormCorrectData = NotNullable<DailyFormData>;
dailyForm.addEventListener("submit", (event) => {
	event.preventDefault();

	if (!event.target) {
		return;
	}

	const data = new FormData(event.target as HTMLFormElement);

	const timeline = {
		start: data.get("start"),
		end: data.get("end"),
		day: +(data.get("day") ?? 0),
	} as DailyFormData;

	Object.entries(timeline).filter(([_, value]) => value !== null);

	if (
		timeline.day === null ||
		timeline.end === null ||
		timeline.start === null
	) {
		throw new Error("Daily form filed data not found!. Check field value.");
	}

	ProfileManager.addTimeline({
		...(timeline as DailyFormCorrectData),
		startDate: createToday(),
	});
	dailyForm.reset();
});
