export function sumArray(array) {

    return array.reduce((accumulator, currentValue) => accumulator + currentValue )

} 

export function multiplyArrayByConst(array, C) {

    return array.map(v => v * C)

}

export function productArray(array_one, array_two) {

    console.assert(array_one.length === array_two.length)

    return array_one.map((e, i) => e * array_two[i])

}

export function geometricCenter(array, x) {

    // Multiplying the last and first values of the array by half improve the numerical precision.
    // This value is derived from the trapezoidal multiplier on the extremes
    // Increase the error if the spaces are not evenly spaced.
    // This method is also, more efficient than reintegrate the volumes twice. @Ferrari212
    const LEN = array.length
    array[LEN-1] = 0.5 * array[LEN-1]
    array[0] = 0.5 * array[0]

    const SUM = sumArray(array)

    return array.reduce((accumulator, currentValue, index) => accumulator + currentValue * x[index], 0) / SUM

    // Possible the integration will give it more correctly, value tried but strange division encountered    
    // const product = productArray(array, x)
    // const MOMENT = simpsonIntegratorDiscrete(product, x)
    // const INTEGRAL = simpsonIntegratorDiscrete(array, x)

    // return MOMENT / INTEGRAL

}

