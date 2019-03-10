import minimatch from "minimatch";

export const shouldProceed = (only: Array<string>, file: string): boolean => {
  if (file === undefined || file === null || file === "") {
    return false;
  }

  if (only.length === 0) {
    return true;
  }

  return only.some(rule => minimatch(file, rule, { matchBase: true }));
};
