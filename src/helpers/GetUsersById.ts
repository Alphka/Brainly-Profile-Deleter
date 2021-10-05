import type { GetUserByIdData } from "@typings/brainly"
import { Request, AddUrlParams } from "@helpers"

export default async function GetUsersById(origin: string, ...ids: (string | number)[]){
	const url = AddUrlParams(origin + "/api/28/api_users/get_by_id", "id[]", ...ids.map(String))
	const response = await Request({ url })
	const { data } = response

	if(!data.success) throw data.message || "GetUsersById failed"
	return data.data as GetUserByIdData[]
}
