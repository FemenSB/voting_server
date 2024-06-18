export function hasDuplicates<T>(array: T[]): boolean {
  const set = new Set<T>();
  for (let i = 0; i < array.length; i++) {
    if (set.has(array[i])) {
      return true;
    } else {
      set.add(array[i]);
    }
  }
  return false;
}
