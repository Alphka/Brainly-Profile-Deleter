import { appendFileSync, existsSync, readFileSync } from "fs"
import { DeleteProfiles } from "@controllers"
import { join } from "path"

const usersPath = join(__dirname, "..", "users.txt")

if(existsSync(usersPath)){
	const users = readFileSync(usersPath, "utf8")

	if(users.trim()) DeleteProfiles(users)
	else console.log("No users found")
}else{
	console.log("Creating users.txt")
	appendFileSync(usersPath, "", "utf8")
}
