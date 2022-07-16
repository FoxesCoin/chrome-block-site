export const createToday = () => {
	const today = new Date();
	today.setMinutes(0);
	today.setSeconds(0);
	today.setHours(0);
	today.setMilliseconds(0);

	return today.toUTCString();
};

export const weeklyForm = document.getElementById(
	"weekly-form"
)! as HTMLFormElement;
export const dailyForm = document.getElementById(
	"daily-form"
)! as HTMLFormElement;
