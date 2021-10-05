import type { AxiosResponse } from "axios"
import { GetSearchParams, RequestProfile, ParamsSerializer } from "@helpers"
import { URL } from "url"
import axios from "axios"

const MatchRegExp = /<form.+id="[a-z]+".+?action="(?<action>[a-z0-9_\/]+)">.+?name="_method".+?value="(?<method>[a-z]+)".+?name="data\[_Token\]\[key\]".+?value="(?<TokenKey>[a-z0-9]+)"[\w\W]+?name="data\[_Token\]\[fields\].+?value="(?<TokenFields>[a-z0-9%]+)".+?name="data\[_Token\]\[lock\]".+?value="(?<TokenLock>[_a-z0-9]+)"/gi

const Cookies = {
	"Zadanepl_cookie[isLoggedIn]": "1",
	"Zadanepl_cookie[Token][Long]": process.env.TokenLong!
}

function ExtractMatchData(match: RegExpMatchArray){
	if(!match.groups) throw new Error("Groups is not defined")

	const { TokenFields, TokenKey, TokenLock, method, action } = match.groups

	if(!TokenFields) throw new Error("TokenFields is not defined")
	if(!TokenKey) throw new Error("TokenKey is not defined")
	if(!TokenLock) throw new Error("TokenLock is not defined")
	if(!method) throw new Error("method is not defined")
	if(!action) throw new Error("action is not defined")

	return { TokenFields, TokenKey, TokenLock, method, action }
}

export default async function DeleteProfile(origin: string, nick: string, id: number){
	console.log("Starting to delete user:", nick)

	const html = (await RequestProfile(origin, nick, id)).data
	const Matches = Array.from(html.matchAll(MatchRegExp))

	function Delete(path: string | URL, match: RegExpMatchArray, hasUserId?: boolean): Promise<AxiosResponse<""> | undefined>
	function Delete(_url: string | URL, match: RegExpMatchArray, hasUserId: boolean = true){
		const { TokenFields, TokenKey, TokenLock, method, action } = ExtractMatchData(match)

		const url = typeof _url === "string" ? new URL(action, _url) : _url

		url.searchParams.set("_method", method)
		url.searchParams.set("data[_Token][key]", TokenKey)
		url.searchParams.set("data[_Token][fields]", TokenFields)
		url.searchParams.set("data[_Token][lock]", TokenLock)

		if(hasUserId) url.searchParams.set("data[uid]", String(id))

		return new Promise(resolve => {
			axios({
				url: url.origin + url.pathname,
				method: "POST",
				data: ParamsSerializer(GetSearchParams(url)),
				headers: {
					"Accept": "text/html",
					"Content-Type": "application/x-www-form-urlencoded",
					"Cookie": Object.entries(Cookies).map(([name, value]) => `${name}=${encodeURIComponent(value)}`).join("; "),
					"User-Agent": "Chrome"
				},
				maxRedirects: 0
			}).then(response => {
				resolve(response)
			}).catch(error => {
				resolve(error.response)
			})
		})
	}

	const DeleteCommentsMatch = Matches.find(match => match[0].includes("delete_comments"))
	const DeleteAnswersMatch = Matches.find(match => match[0].includes("delete_responses"))
	const DeleteQuestionsMatch = Matches.find(match => match[0].includes("delete_tasks"))
	const DeleteProfile = Matches.find(match => match[0].includes("DelUserAddForm"))

	const Promises: ReturnType<typeof Delete>[] = new Array
	if(DeleteCommentsMatch) Promises.push(Delete(origin, DeleteCommentsMatch))
	if(DeleteAnswersMatch) Promises.push(Delete(origin, DeleteAnswersMatch))
	if(DeleteQuestionsMatch) Promises.push(Delete(origin, DeleteQuestionsMatch))

	await Promise.allSettled(Promises)

	if(DeleteProfile){
		const url = new URL(DeleteProfile.groups!.action, origin)

		url.searchParams.append("data[DelUser][reason]", "[BOT] Publicidade")
		url.searchParams.append("data[DelUser][delResponses]", "1")
		url.searchParams.append("data[DelUser][delTasks]", "1")
		url.searchParams.append("data[DelUser][delComments]", "1")

		return await Delete(url, DeleteProfile, false)
	}
}
