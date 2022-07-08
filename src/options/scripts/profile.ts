import equal from "fast-deep-equal";
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

const PROFILE_TEMPLATE: ProfileData = {
	id: 0,
	sites: [],
	timelines: [],
};

export class Profile {
	#profiles: ProfileData[] = [];
	#nextId: number = 0;
	#activeProfile: ProfileData = PROFILE_TEMPLATE;

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

	#setProfiles(newProfiles: ProfileData[]) {
		this.#profiles = newProfiles;
	}

	setActiveProfileById(id: number) {
		const profile = this.profiles.find((profile) => profile.id === id);
		if (!profile) {
			throw new Error("Not found profile by this index");
		}

		if (profile.id === this.#activeProfile.id) {
			return;
		}

		this.#activeProfile = profile;
		loadSites(profile.sites);
		loadTimelines(profile.timelines);
	}

	async loadData() {
		const data = await getProfiles();
		this.#setProfiles(data);
		this.#nextId = Math.max(...this.profiles.map((profile) => profile.id));
		this.setActiveProfileById(data[0].id);
	}

	async #updateProfile(
		getNewData: (currentProfile: ProfileData) => Partial<ProfileFields>
	) {
		const index = this.profiles.findIndex(
			(profile) => profile.id === this.idProfile
		);

		if (index === -1) {
			throw new Error("Profile not found! Please check id.");
		}

		const newProfile = {
			...this.profiles[index],
			...getNewData(this.profiles[index]),
		};

		this.profiles[index] = newProfile;
		this.#activeProfile = newProfile;

		await setProfiles(this.profiles);
	}

	async createProfile() {
		const newId = this.#nextId + 1;
		const newProfiles = addArrayItem(this.profiles, {
			id: newId,
			sites: [],
			timelines: [],
		});
		this.#nextId = newId;
		this.#setProfiles(newProfiles);
		await setProfiles(this.profiles);
	}

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
