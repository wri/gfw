export function encodeStateForUrl(obj) {
  return btoa(JSON.stringify(obj));
}

export function decodeUrlForState(string) {
  return JSON.parse(atob(string));
}
