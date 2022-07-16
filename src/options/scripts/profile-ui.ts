import { ProfileData } from "../../utils";
import { ProfileManager } from "./profile";

const profileList = document.getElementById("profiles")!;

const createNameField = (profileData: ProfileData) => {
	const input = document.createElement("span");

	input.classList.add("profile__input");
	input.innerHTML = profileData.name;

	return input;
};

const createRemoveIcon = (profileId: number) => {
	const img = document.createElement("img");
	img.src = "../assets/cross.svg";
	img.alt = "Remove profile";
	img.classList.add("profile__icon", "profile__icon_remove");
	img.addEventListener("click", () => {
		ProfileManager.removeProfile(profileId);
	});

	return img;
};

const createEditIcon = () => {
	const img = document.createElement("img");
	img.src = "../assets/edit.svg";
	img.alt = "New name";
	img.classList.add("profile__icon", "profile__icon_edit");

	return img;
};

const createProfileUI = (profileData: ProfileData) => {
	const profile = document.createElement("div");
	const id = profileData.id;
	const input = createNameField(profileData);
	const edit = createEditIcon();
	const remove = createRemoveIcon(id);

	profile.classList.add("profile");
	if (profileData.id === ProfileManager.idProfile) {
		profile.classList.add("profile_active");
	}

	const endRename = () => {
		if (!input.innerHTML.trim()) {
			return alert("New name should have minimum 1 character.");
		}

		input.classList.remove("profile__input_editable");
		input.removeAttribute("contentEditable");
		ProfileManager.renameProfile(id, input.innerHTML);
	};

	edit.addEventListener("click", (event) => {
		event.stopPropagation();
		event.preventDefault();
		if (input.getAttribute("contentEditable") !== "") {
			input.setAttribute("contentEditable", "");
			input.classList.add("profile__input_editable");
			input.focus();
			return;
		}
		endRename();
	});

	input.addEventListener("keydown", (event: KeyboardEvent) => {
		if (event.key !== "Enter") {
			return;
		}
		endRename();
	});

	const actionBar = document.createElement("div");
	actionBar.classList.add("profile__action-bar");
	actionBar.appendChild(edit);
	actionBar.appendChild(remove);

	profile.appendChild(input);
	profile.appendChild(actionBar);

	profile.addEventListener("click", () => {
		ProfileManager.setActiveProfileById(profileData.id);
	});

	return profile;
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
}
