export const uniqueArray = (array) => {
    const makeUniqueArray = Array.from(new Set(array))
    return makeUniqueArray
}

export const countPerGrupArray = (array) => {
    const countArray = array.reduce((acc, curr) => {
        if (curr in acc) {
          acc[curr]++;
        } else {
          acc[curr] = 1;
        }
        return acc;
      }, {});
    return countArray
}