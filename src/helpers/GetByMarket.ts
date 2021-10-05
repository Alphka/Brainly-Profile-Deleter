import type { Markets } from "@typings/main"
import { BrainlyDetails } from "@helpers"

export default function GetByMarket(market: Markets, type: "origin" | "profile"){
	const entries = Object.entries(BrainlyDetails)
	const match = entries.find(([hostname, details]) => details.market === market)

	if(!match) throw new Error("Invalid market")

	switch(type){
		case "origin": return "https://" + match[0]
		case "profile": return match[1].profile
	}
}
