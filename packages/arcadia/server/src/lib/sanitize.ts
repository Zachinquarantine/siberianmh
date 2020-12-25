export const sanitizeTitle = (string: string): string =>
  string.replace(/ /g, '-').replace(/[.,()\:"#]/g, '')
