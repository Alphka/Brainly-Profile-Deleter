export default function AddUrlParams(url: string, name: string, ...values: string[]){
	if(!url.endsWith("?")) url += "?"

	const query = values.map(e => `${name}=${decodeURIComponent(e)}`)
	return url + query.join("&")
}
