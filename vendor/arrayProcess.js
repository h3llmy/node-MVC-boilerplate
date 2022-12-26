export const uniqueArray = (array) => {
    return Array.from(new Set(array))
}

export const countPerGrupArray = (array) => {
    return array.reduce((acc, curr) => {
        if (curr in acc) {
          acc[curr]++;
        } else {
          acc[curr] = 1;
        }
        return acc;
      }, {});
}

export const grupByObjectArray = (array, groupBy) => {
  return array.reduce((groups, curr) => {
    const group = groups.find(group => group[groupBy] === curr[groupBy]);
    if (group) {
      group.list.push(curr);
    } else {
      groups.push({ [groupBy]: curr[groupBy], list: [curr] });
    }
    return groups;
  }, []);
}

export const objectToArrayObject = (object) => {
  return Object.entries(object).map(([group, count]) => ({ [group]: count }));
}