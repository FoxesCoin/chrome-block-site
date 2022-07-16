import equal from "fast-deep-equal";

interface UpdateProfiles {
	oldProfile: ProfileData | null;
	newProfile: ProfileData | null;
}

export interface Timer {
	start: string;
	end: string;
}

export interface Daily extends Timer {
	day: number;
	startDate: string;
}

export interface Weekly extends Timer {
	days: number[];
}

export type Timeline = Daily | Weekly;

export interface ProfileFields {
	name: string;
	sites: string[];
	timelines: Timeline[];
}

export interface ProfileData extends ProfileFields {
	readonly id: number;
}

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

export const createDateByTime = (time: string) => {
	const [hour, minute] = time.split(":");
	const date = new Date();
	date.setHours(+hour);
	date.setMinutes(+minute);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date;
};

const searchUpdateProfile = (
	first: ProfileData[],
	second: ProfileData[]
): ProfileData =>
	first.find((profile) =>
		second.some((oldProfile) => oldProfile.id === profile.id)
	)!;

export const getUpdatedProfile = (
	newProfiles: ProfileData[],
	oldProfiles: ProfileData[]
): UpdateProfiles => {
	if (newProfiles.length > oldProfiles.length) {
		return {
			newProfile: searchUpdateProfile(newProfiles, oldProfiles),
			oldProfile: null,
		};
	}

	if (newProfiles.length < oldProfiles.length) {
		return {
			oldProfile: searchUpdateProfile(oldProfiles, newProfiles),
			newProfile: null,
		};
	}

	const changedProfile = newProfiles.find((newProfile) =>
		oldProfiles.some((oldProfile) => !equal(oldProfile, newProfile))
	)!;

	return {
		newProfile: changedProfile,
		oldProfile: oldProfiles.find(
			(profile) => profile.id === changedProfile.id
		)!,
	};
};
