export function sumArray(array) {

    return array.reduce((accumulator, currentValue) => accumulator + currentValue )

} 

export function geometricCenter(array, x) {

    const SUM = sumArray(array)

    return array.reduce((accumulator, currentValue, index) => accumulator + currentValue * x[index], 0) / SUM

}

