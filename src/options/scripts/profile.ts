import equal from "fast-deep-equal";
import cloneDeep from "lodash.clonedeep";
import { loadSites } from "./sites-ui";
import { loadTimelines } from "./timeline-ui";

import {
	addArrayItem,
	getProfiles,
	ProfileData,
	ProfileFields,
	removeArrayItem,
	setProfiles,
	Timeline,
} from "../../utils";
import { loadProfiles } from "./profile-ui";

const PROFILE_TEMPLATE: ProfileFields = {
	name: "Default",
	sites: [],
	timelines: [],
};

export class Profile {
	#profiles: ProfileData[] = [];
	#nextId: number = 0;
	#activeProfile: ProfileData = { ...PROFILE_TEMPLATE, id: 0 };

	#setActiveProfile = (profile: ProfileData) => {
		this.#activeProfile = profile;
		loadSites(profile.sites);
		loadTimelines(profile.timelines);
	};

	async #requestSetProfiles(newProfiles: ProfileData[]) {
		try {
			this.#profiles = newProfiles;
			await setProfiles(newProfiles);
		} catch {
			console.error("Profile not updated. Check google services.");
		}
	}

	async #updateProfile(
		getNewData: (currentProfile: ProfileData) => Partial<ProfileFields>,
		id = this.idProfile
	) {
		const index = this.profiles.findIndex((profile) => profile.id === id);

		if (index === -1) {
			throw new Error("Profile not found! Please check id.");
		}
		const newValue = getNewData(this.profiles[index]);

		if (Object.keys(newValue).length === 0) {
			return;
		}

		const newProfile = { ...this.profiles[index], ...newValue };

		this.profiles[index] = newProfile;
		this.#setActiveProfile(newProfile);

		await setProfiles(this.profiles);
	}

	get profiles() {
		return this.#profiles;
	}

	get activeProfile() {
		return this.#activeProfile;
	}

	get idProfile() {
		const id = this.#activeProfile?.id;

		if (!id) {
			throw new Error(
				"Active profile not loaded yet. Call function `loadData`."
			);
		}

		return id;
	}

	updateProfiles(
		profiles: ProfileData[],
		idActiveProfile: number = this.idProfile
	) {
		this.#profiles = profiles;
		this.setActiveProfileById(idActiveProfile);
		loadProfiles(profiles);
	}

	async loadData() {
		const data = await getProfiles();
		this.#nextId = Math.max(...data.map((profile) => profile.id));
		this.updateProfiles(data, data[0].id);
	}

	setActiveProfileById(id: number) {
		const profile = this.profiles.find((profile) => profile.id === id);
		if (!profile) {
			throw new Error("Not found profile by this index");
		}

		this.#setActiveProfile(profile);
	}

	async createProfile() {
		const newId = this.#nextId + 1;
		const newProfiles = addArrayItem(this.profiles, {
			...PROFILE_TEMPLATE,
			id: newId,
			name: `Profile #${newId}`,
		});
		this.#nextId = newId;
		await this.#requestSetProfiles(newProfiles);
	}

	async removeProfile(id: number) {
		if (this.profiles.length === 1) {
			return alert("You can't remove all profiles. You should have minimum 1.");
		}

		const profiles = cloneDeep(this.profiles);
		const index = profiles.findIndex((profile) => profile.id === id);
		profiles.splice(index, 1);
		this.#activeProfile = profiles[index === 0 ? 0 : index - 1];
		await this.#requestSetProfiles(profiles);
	}

	renameProfile = (id: number, newName: string) => {
		this.#updateProfile(
			(before) =>
				newName.trim() === before.name ? {} : { name: newName.trim() },
			id
		);
	};

	addTimeline(newTimeline: Timeline) {
		const oldTimelines = this.#activeProfile.timelines;

		if (oldTimelines.some((timeline) => equal(timeline, newTimeline))) {
			return alert("This timeline already exist!");
		}

		return this.#updateProfile((before) => ({
			timelines: addArrayItem(before.timelines, newTimeline),
		}));
	}

	removeTimeline = (timeline: Timeline) =>
		this.#updateProfile((before) => ({
			timelines: removeArrayItem(before.timelines, timeline),
		}));

	addSite = (site: string) =>
		this.#updateProfile((before) => ({
			sites: addArrayItem(before.sites, site.toLocaleLowerCase()),
		}));

	removeSite = (site: string) =>
		this.#updateProfile((before) => ({
			sites: removeArrayItem(before.sites, site),
		}));
}

export const ProfileManager = new Profile();
