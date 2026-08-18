/**
 * Signals that a metadata key was syntactically valid but does not exist on
 * the backend that was asked for it. This is distinct from a generic Error,
 * which represents an upstream failure (timeout, 5xx, auth problem, etc.).
 *
 * Keeping the two separate lets a caller safely say "try the next backend
 * only when this one has genuinely never heard of the key" without also
 * swallowing real outages as if they were 404s.
 */
export class MetadataNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MetadataNotFoundError';
  }
}
