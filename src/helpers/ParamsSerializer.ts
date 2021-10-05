export default function ParamsSerializer(params: {[k: string]: string | null}){
	const entries = Object.entries(params)

	return entries.map(([name, value]) => {
		return value ? `${name}=${value}` : name
	}).join("&")
}
