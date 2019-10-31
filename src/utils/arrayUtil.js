const sortArrayByWeight = (arr = []) => {
	return arr.sort((a, b) => (a.weight > b.weight ? -1 : b.weight > a.weight ? 1 : 0))
}

module.exports = {
	sortArrayByWeight,
}
