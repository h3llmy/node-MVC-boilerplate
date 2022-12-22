export const uniqueArray = (array) => {
    const makeUniqueArray = Array.from(new Set(array))
    return makeUniqueArray
}