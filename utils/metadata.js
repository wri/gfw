export const isValidMetadataPath = (path) =>
  typeof path === 'string' && /^[a-zA-Z0-9/_-]+$/.test(path);

export default {
  isValidMetadataPath,
};
