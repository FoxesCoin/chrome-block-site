export const createToday = () => {
	const today = new Date();
	today.setMinutes(0);
	today.setSeconds(0);
	today.setHours(0);
	today.setMilliseconds(0);

	return today.toUTCString();
};

export const createDateByTime = (time: string) => {
	const [hour, minute] = time.split(":");
	const date = new Date();
	date.setHours(+hour);
	date.setMinutes(+minute);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date;
};

export const weeklyForm = document.getElementById(
	"weekly-form"
)! as HTMLFormElement;
export const dailyForm = document.getElementById(
	"daily-form"
)! as HTMLFormElement;
