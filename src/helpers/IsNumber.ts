export default function IsNumber(string: string){
	if(!string) return false
	return Number.isFinite(Number(string)) && !Number.isNaN(Number(string))
}
