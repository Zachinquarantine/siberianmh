export const GIST_REGEX = /https?:\/\/(?:www\.)?gist.github\.com\/([0-9a-f]{32})$/gm

export const generateFiddleRunURL = (gistId: string) => {
  return `https://fiddle.electronjs.org/launch?target=gist/${gistId}`
}
