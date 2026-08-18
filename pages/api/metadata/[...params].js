import { resolveMetadata } from 'utils/metadata/resolve';
import { isValidMetadataPath } from 'utils/metadata/is-valid-metadata-path';
import { MetadataNotFoundError } from 'utils/metadata/errors';

export default async (req, res) => {
  const path = req.query.params.join('/');

  // "Is this safe input?" is answered here, independently of whether
  // metadata for it actually exists — no whitelist involved.
  if (!isValidMetadataPath(path)) {
    return res.status(400).json({ error: 'Invalid path parameter' });
  }

  try {
    const response = await resolveMetadata(path);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof MetadataNotFoundError) {
      return res.status(404).json({ error: 'Metadata not found' });
    }

    // Any other failure means we couldn't successfully resolve the request
    // against an upstream metadata service. This route is explicitly a
    // proxy, so 502 reflects that honestly instead of the previous
    // behavior of reporting every failure as a malformed request (400).
    return res.status(502).json({ error: 'Upstream metadata service error' });
  }
};
