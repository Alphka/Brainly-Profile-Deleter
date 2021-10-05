import { existsSync, readFileSync, writeFileSync } from "fs"
import { join, resolve } from "path"

const root = resolve(__dirname, "../..")
const path = join(root, ".env")

export default function AddToEnv(property: string, value: string){
	let data = existsSync(path) ? readFileSync(path, "utf8").trim() : ""

	if(data) data += "\n"

	writeFileSync(path, `${data + property}=${JSON.stringify(value)}\n`, "utf8")
}
