/** @param time Time in seconds */
export default function Sleep(time: number){
	return new Promise(resolve => setTimeout(resolve, time * 1000))
}
