import { URL } from "url"

export default function GetSearchParams(url: string | URL){
	const Url = url instanceof URL ? url : new URL(url)

	return Object.fromEntries(Url.search.substr(1).split("&").map(param => {
		const [name, value] = param.split("=") as [string] | [string, string]
		return [name, value || null]
	}))
}
