import { ProfileData } from "../../utils";
import { ProfileManager } from "./profile";

const profileList = document.getElementById("profiles")!;

const createProfileUI = (profileData: ProfileData) => {
	const profile = document.createElement("div");

	if (profileData.id === ProfileManager.idProfile) {
		profile.classList.add("profile_active");
	}

	profile.classList.add("profile");
	profile.innerHTML = profileData.id + "";
	profile.addEventListener("click", () => {
		ProfileManager.setActiveProfileById(profileData.id);
	});

	return profile;
};

const createAddProfileButton = () => {
	const addButton = document.createElement("button");

	addButton.innerHTML = "Add";
	addButton.classList.add("profile__button");
	addButton.addEventListener("click", () => {
		ProfileManager.createProfile();
	});

	profileList.appendChild(addButton);
};

export function loadProfiles(profiles: ProfileData[]) {
	profileList.innerHTML = "";
	const profilesUi = profiles.map(createProfileUI);

	profilesUi.forEach((profile) => {
		profile.addEventListener("click", () => {
			profilesUi.forEach((profileUi) =>
				profileUi.classList.remove("profile_active")
			);
			profile.classList.add("profile_active");
		});
		profileList.appendChild(profile);
	});

	createAddProfileButton();
}
