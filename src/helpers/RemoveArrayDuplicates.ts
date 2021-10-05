export default function RemoveArrayDuplicates<T extends any[]>(array: T){
	const newArray = new Array as T
	array.forEach(item => !newArray.includes(item) && newArray.push(item))
	return newArray
}
