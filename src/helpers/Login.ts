import { headers, Request } from "@helpers"
import config from "config.json"

export default async function Login(origin: string){
	const url = origin + "/api/28/api_account/authorize"

	const {
		Username: username,
		Password: password
	} = config

	if(!username) throw new Error("Invalid username")
	if(!password) throw new Error("Invalid password")

	const Headers = Object.assign({
		"Content-Type": "applcation/json"
	}, headers) as any

	delete Headers["X-B-Token-Long"]

	const response = await Request({
		url,
		headers: Headers,
		data: { username, password }
	})

	return response?.headers["x-b-token-long"] as string | undefined
}
