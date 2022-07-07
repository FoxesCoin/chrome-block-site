import equal from "fast-deep-equal";

export type Nullable<T> = {
	[P in keyof T]: T[P] | null;
};

export interface Timer {
	start: string;
	end: string;
}

export interface Daily extends Timer {
	day: string;
	startDate: string;
}

export interface Weekly extends Timer {
	days: number[];
}

export type Timeline = Daily | Weekly;

export interface ProfileFields {
	sites: string[];
	timelines: Timeline[];
}

export interface ProfileData extends ProfileFields {
	readonly id: number;
}

export const isMatchDays = (first: number[], second: number[]): boolean => {
	if (first.length !== second.length) return false;

	for (let index = 0; index < first.length; index++) {
		if (first[index] !== second[index]) return false;
	}

	return true;
};

export const isWeekly = (timeline: any): timeline is Weekly => !!timeline?.days;

export const addArrayItem = <T>(array: T[], item: T): T[] => [...array, item];
export const removeArrayItem = <T>(array: T[], item: T): T[] => {
	const index = array.findIndex((element) => equal(element, item));
	if (index === -1) {
		console.error("removeArrayItem - parameter:", { array, item });
		throw new Error("Item not found! Check value again.");
	}

	array.splice(index, 1);

	return array;
};

export const getProfiles = () =>
	new Promise<ProfileData[]>((resolve, reject) => {
		try {
			chrome.storage.local.get("profiles", (data) => {
				if (!data?.profiles) {
					reject(new Error("Profiles not found!"));
				}

				resolve(data?.profiles ?? []);
			});
		} catch (error) {
			reject(error);
		}
	});

export const setProfiles = (profiles: ProfileData[]) =>
	new Promise<boolean>((resolve, reject) => {
		try {
			chrome.storage.local.set({ profiles }, function () {
				resolve(true);
			});
		} catch (ex) {
			reject(ex);
		}
	});
