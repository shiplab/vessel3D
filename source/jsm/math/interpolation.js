export function bisectionSearch(array, value) {
    if (value < array[0]) {
        console.warn("bisectionSearch: requested value below lowest array element. Returning undefined.");
        return {index: undefined, mu: undefined};
    }

    let index = 0,
        upper = array.length;
    while (upper > index + 1) {
        let c = Math.floor(0.5 * (index + upper));
        if (array[c] === value) return {index: c, mu: 0};
        else if (array[c] < value) index = c;
        else upper = c;
    }

    /*if (index === array.length) {
		console.error("bisectionSearch: index===array.length. This should never happen.");
	}*/
    let mu = (value - array[index]) / (array[index + 1] - array[index]);
    if (index === array.length - 1) {
        console.warn("bisectionSearch: Reached end of array. Simple interpolation will result in NaN.");
        mu = undefined;
    }

    return {index, mu};
}

//linear interpolation
//Defaults are not finally decided
//returns NaN if a and b are NaN or mu is NaN.
export function lerp(a, b, mu = 0.5) {
    if (isNaN(a)) return b;
    if (isNaN(b)) return a;
    return (1 - mu) * a + mu * b;
}
