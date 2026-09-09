export const isValidMetadataKey = (key) =>
  typeof key === 'string' && /^[a-zA-Z0-9_-]+$/.test(key);

export const isValidMetadataPath = (path) =>
  typeof path === 'string' &&
  /^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(path);

export default {
  isValidMetadataKey,
  isValidMetadataPath,
};
