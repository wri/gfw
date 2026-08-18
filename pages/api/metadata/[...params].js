import { getDataApiMetadata } from 'utils/metadata/data-api';
import { getResourceWatchMetadata } from 'utils/metadata/resource-watch';

import METADATA_LIST from '../../../data/metadata.json';
import METADATA_EXCEPTION_LIST from '../../../data/metadata-exception.json'; // a list of metadata that isn't on Data API

export default async (req, res) => {
  try {
    const userPath = req.query.params[0];
    const isExternalMetadata = METADATA_EXCEPTION_LIST.includes(userPath);
    const safePaths = [...METADATA_LIST, ...METADATA_EXCEPTION_LIST].filter(
      (path) => path === userPath
    );

    if (safePaths.length === 0) {
      return res.status(400).end('Invalid path');
    }

    if (isExternalMetadata) {
      const response = await getResourceWatchMetadata(safePaths[0]);
      return res.status(200).json(response);
    }

    const response = await getDataApiMetadata(safePaths[0]);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).end(error.message);
  }
};
