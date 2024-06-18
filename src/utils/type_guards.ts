export function isString(input: any): input is string {
  return typeof input === 'string';
}

export function isStringArray(input: any): input is string[] {
  if (!Array.isArray(input)) {
    return false
  };
  return input.every(isString);
}
