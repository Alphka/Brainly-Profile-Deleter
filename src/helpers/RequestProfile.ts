import { Request, headers } from "@helpers"

export default function RequestProfile(origin: string, nick: string, id: number){
	const url = `${origin}/perfil/${nick}-${id}/submitted`

	return Request<string>({
		url,
		headers,
		method: "GET",
		maxRedirects: 1
	})
}
