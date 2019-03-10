export const formatTailwindObject = (object: Object): Object => {
  return Object.keys(object)
    .filter(key => key.includes("."))
    .map(key => {
      let newKey = key.replace("\\", "");
      return { [newKey]: object[key] };
    })
    .reduce((acc, current) => {
      for (const key in current) {
        if (key.includes(",")) {
          const splitKey = key.split(",");
          acc[splitKey[0]] = current[key];
          acc[splitKey[1]] = current[key];

          delete acc[key];

          return acc;
        }
        acc[key] = current[key];
      }
      return acc;
    }, {});
};
