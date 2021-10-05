export type Markets =
	| "pt"
	| "us"
	| "ph"
	| "id"
	| "ro"
	| "tr"
	| "es"
	| "ru"
	| "pl"
	| "hi"
	| "fr"

export interface DeleteProfileOptions {
	profileUrl?: string
	id?: number | string
}

export interface Config {
	Market: Markets
	Username: string
	Password: string
}
