import type { GetUserByIdData } from "@typings/brainly"
import type { Config } from "@typings/main"
import { AddToEnv, GetByMarket, GetUsersById, IsNumber, Login, RemoveArrayDuplicates, Sleep } from "@helpers"
import { DeleteProfile } from "@controllers"
import config from "config.json"

async function VerifyToken(origin: string){
	const { TokenLong } = process.env

	if(!TokenLong){
		console.log("Trying to login")
		const Token = await Login(origin)

		if(Token){
			AddToEnv("TokenLong", Token)
			process.env.TokenLong = Token
		}else throw new Error("Login failed")
	}else if(TokenLong.length !== 44) throw new Error("Invalid TokenLong: " + TokenLong)
}

function GetUserIds(string: string){
	const ExtractId = (id: string) => {
		const match = id.replace(/.*?[-:/"](?=\d)|[?/"#].*|[a-z]+/gi, "")

		if(IsNumber(id)) return Number(id)
		if(IsNumber(match)) return Number(match)
	}

	return RemoveArrayDuplicates(string
		.split(/(\n|\r\n|\t)+/)					// Remove trailing lines
		.filter(line => line.trim())			// Remove empty strings
		.map(ExtractId)							// Get user id
		.filter(Boolean)						// Remove undefined id
		.filter(id => String(id).length > 6)	// Filter numbers with +7 length
	) as number[]
}

export default async function DeleteProfiles(usersString: string){
	const origin = GetByMarket((config as Config).Market, "origin")

	await VerifyToken(origin)

	const UsersIds = GetUserIds(usersString)
	const UsersDetails = await GetUsersById(origin, ...UsersIds)
	const DeletedUsers: GetUserByIdData[] = new Array
	const ActiveUsers: GetUserByIdData[] = new Array
	const Instances: ReturnType<typeof DeleteProfile>[] = new Array

	UsersDetails.forEach(user => {
		if(user.is_deleted) return DeletedUsers.push(user)
		if(user.ranks_ids.length > 2) return console.log("Avoiding user:", user.id)

		ActiveUsers.push(user)
	})

	DeletedUsers.forEach(user => console.warn("User is already deleted:", user.id))

	ActiveUsers.forEach(async ({ nick, id }) => {
		const promise = DeleteProfile(origin, nick, id)

		Instances.push(promise)

		const response = await promise
		const setCookie = response?.headers["set-cookie"] as string[] | undefined

		if(setCookie){
			const infobarCookie = setCookie.find(cookie => cookie.includes("Zadanepl_cookie[infobar]"))

			interface InfobarMesage {
				text: string
				layout: "default"
				class: "info" | "failure"
			}

			if(infobarCookie){
				const messageDecoded = Buffer.from(infobarCookie.split(";")[0].split("=")[1], "base64").toString("utf8")
				const messageObject = JSON.parse(decodeURIComponent(messageDecoded))[0] as InfobarMesage

				if(messageObject.class === "info") console.log(`${messageObject.text}: ${nick}`)
				else console.error(`Error: ${messageObject.text} - ${nick}`)

				return
			}
		}

		throw `Error trying to delete user: ${nick}`
	})

	return await Promise.allSettled(Instances).then(results => {
		console.log("Code finished")
		return results
	})
}
