export const isValidMetadataPath = (path) =>
  typeof path === 'string' &&
  /^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(path);

export default {
  isValidMetadataPath,
};
