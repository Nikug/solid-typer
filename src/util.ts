/*
 * Gets random integer value between min and max
 * @param {end} min - inclusive
 * @param {end} max - exclusive
 */
export const randomBetween = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

/*
 * Returns random item from array
 * @param {T[]} array - Array to get the item from
 */
export const getRandomFromArray = <T>(array: T[]): T => {
  return array[randomBetween(0, array.length)]
}

/*
 * Returns the number of matching items from two arrays by comparing
 * items from both arrays at each index.
 * @param {T[]} arrayA - First array
 * @param {T[]} arrayB - Second array
 */
export const numberOfMatchingItems = <T extends string | unknown[]>(
  arrayA: T,
  arrayB: T
): number => {
  const limit = arrayA.length > arrayB.length ? arrayA.length : arrayB.length
  let matchingItems = 0
  for (let i = 0; i < limit; i++) {
    if (arrayA[i] === arrayB[i]) {
      matchingItems++
    }
  }

  return matchingItems
}
