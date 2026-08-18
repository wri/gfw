// This answers exactly one question: "is this safe input?" — never "does
// metadata with this key exist?". Existence is determined by actually
// asking the upstream backends (see resolve.js), not by consulting a local
// list. Keeping these two questions separate is the point: a whitelist
// conflates them, which is what let syntactically-fine widget keys get
// rejected before either upstream service had a chance to resolve them.
const VALID_METADATA_PATH = /^[a-zA-Z0-9/_-]+$/;

export const isValidMetadataPath = (path) =>
  typeof path === 'string' && path.length > 0 && VALID_METADATA_PATH.test(path);
