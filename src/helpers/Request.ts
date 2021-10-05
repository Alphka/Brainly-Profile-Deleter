import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { headers } from "@helpers"

const Cookies: Map<string, string> = new Map

export default async function Request<T = any>(config: AxiosRequestConfig){
	let response: AxiosResponse<T>

	if(!config.headers) config.headers = headers
	if(!config.method) config.method = "GET"

	config.headers.Cookie = config.headers.Cookie ? config.headers.Cookie += "; " : ""
	config.headers.Cookie += Array.from(Cookies.entries()).map(entry => entry.join("=")).join("; ")

	await new Promise<void>(resolve => {
		axios(config)
			.then(e => response = e)
			.catch(error => {
				if(error instanceof TypeError) console.error(error)
				response = error.response
			})
			.finally(resolve)
	})

	if(response!.headers?.["set-cookie"]) (response!.headers["set-cookie"] as string[]).forEach(cookie => {
		const [name, value] = cookie.split(";")[0].split("=")
		Cookies.set(name, value)
	})

	return response! || {}
}
