export { default as RemoveArrayDuplicates } from "./RemoveArrayDuplicates"
export { default as ParamsSerializer } from "./ParamsSerializer"
export { default as GetSearchParams } from "./GetSearchParams"
export { default as RequestProfile } from "./RequestProfile"
export { default as GetUsersById } from "./GetUsersById"
export { default as AddUrlParams } from "./AddUrlParams"
export { default as GetByMarket } from "./GetByMarket"
export { default as IsNumber } from "./IsNumber"
export { default as AddToEnv } from "./AddToEnv"
export { default as Request } from "./Request"
export { default as Sleep } from "./Sleep"
export { default as Login } from "./Login"

import dotenv from "dotenv"

dotenv.config()

export const headers = {
	"User-Agent": "Chrome",
	"X-Requested-With": "XMLHttpRequest",
	get "X-B-Token-Long"(){
		return process.env.TokenLong!
	}
}

export const BrainlyDetails = {
	"brainly.com.br": {
		market: "pt",
		profile: "perfil"
	},
	"brainly.com": {
		market: "us",
		profile: "profile"
	},
	"brainly.ph": {
		market: "ph",
		profile: "profile"
	},
	"brainly.co.id": {
		market: "id",
		profile: "profil"
	},
	"brainly.ro": {
		market: "ro",
		profile: "profil"
	},
	"eodev.com": {
		market: "tr",
		profile: "profil"
	},
	"brainly.lat": {
		market: "es",
		profile: "perfil"
	},
	"znanija.com": {
		market: "ru",
		profile: "profil"
	},
	"brainly.pl": {
		market: "pl",
		profile: "profil"
	},
	"brainly.in": {
		market: "hi",
		profile: "profile"
	},
	"nosdevoirs.fr": {
		market: "fr",
		profile: "profil"
	}
}
