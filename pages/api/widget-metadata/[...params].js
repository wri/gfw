import { getResourceWatchMetadata } from 'utils/metadata/resource-watch';

export default async (req, res) => {
  try {
    const path = req.query.params.join('/');

    // Validate the path to prevent SSRF and path traversal attacks
    const isValidPath = /^[a-zA-Z0-9/_-]+$/.test(path); // Allow only alphanumeric, '/', '_', and '-'
    if (!isValidPath) {
      return res.status(400).json({ error: 'Invalid path parameter' });
    }

    const response = await getResourceWatchMetadata(path);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).end(error.message);
  }
};
