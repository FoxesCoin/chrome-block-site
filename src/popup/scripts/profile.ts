import { getProfiles, ProfileData, setProfiles } from "../../utils";
import { toggleButton } from "./add-site-button";
import { siteUrl } from "./url";

interface ActiveProfile extends ProfileData {
	index: number;
}

const ELEMENT_SIZE = 236;

const profileList = document.getElementById("profile")!;
const nextProfile = document.querySelector(".profile-wrapper__button_next")!;
const beforeProfile = document.querySelector(
	".profile-wrapper__button_before"
)!;

export class Profile {
	#profiles: ProfileData[] = [];
	#activeProfile: ActiveProfile | undefined;

	#createProfilePreview = (profile: ProfileData) => {
		const item = document.createElement("span");
		item.innerHTML = profile.name;
		item.classList.add("profile");

		return item;
	};

	#moveBetweenProfiles(isNext: boolean) {
		const newIndex = (this.#activeProfile?.index ?? 0) + (isNext ? 1 : -1);
		const newValue: ActiveProfile = {
			...this.#profiles[newIndex],
			index: newIndex,
		};
		this.#activeProfile = newValue;
		toggleButton(newValue.sites);
	}

	async #parseProfiles(profiles: ProfileData[]) {
		profiles.forEach((profile) =>
			profileList.appendChild(this.#createProfilePreview(profile))
		);
	}
	async #loadData() {
		const data = await getProfiles();
		this.#profiles = data;
		this.#activeProfile = { ...data[0], index: 0 };

		this.#parseProfiles(data);
	}

	#findActiveProfile = (profile: ProfileData) =>
		profile.id === this.#activeProfile?.id;

	constructor() {
		this.#loadData();
	}

	getNewProfiles(profiles: ProfileData[]) {
		const updatedActiveProfile = profiles.find(this.#findActiveProfile);
		if (updatedActiveProfile) {
			const index = profiles.findIndex(this.#findActiveProfile);
			this.#activeProfile = { ...updatedActiveProfile, index };
		} else {
			this.#activeProfile = { ...profiles[0], index: 0 };
		}
		profileList.scroll({ left: ELEMENT_SIZE * this.#activeProfile.index });

		this.#profiles = profiles;
		this.#parseProfiles(profiles);
	}

	get activeProfile() {
		// @ts-ignore
		const { index, ...profile } = this.#activeProfile;
		return profile as ProfileData;
	}

	goNext() {
		if (profileList.scrollLeft === ELEMENT_SIZE * (this.#profiles.length - 1)) {
			return;
		}

		profileList.scroll({ left: profileList.scrollLeft + ELEMENT_SIZE });
		this.#moveBetweenProfiles(true);
	}

	goBefore() {
		if (!profileList.scrollLeft) {
			return;
		}

		profileList.scroll({ left: profileList.scrollLeft - ELEMENT_SIZE });
		this.#moveBetweenProfiles(false);
	}

	async addSite() {
		const index = this.#activeProfile?.index ?? 0;
		const item = this.#profiles[index];

		const newProfile: ProfileData = {
			...item,
			sites: item.sites.concat(siteUrl),
		};

		this.#profiles[index] = newProfile;
		this.#activeProfile = { ...newProfile, index };

		await setProfiles(this.#profiles);
	}
}

export const ProfileManager = new Profile();

nextProfile.addEventListener("click", () => {
	ProfileManager.goNext();
});
beforeProfile.addEventListener("click", () => {
	ProfileManager.goBefore();
});
