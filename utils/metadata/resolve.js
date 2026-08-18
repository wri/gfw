import { getDataApiMetadata } from './data-api';
import { getResourceWatchMetadata } from './resource-watch';
import { MetadataNotFoundError } from './errors';

/**
 * The single place the Data-API-first / Resource-Watch-fallback ordering
 * lives. Not yet wired into any route — pages/api/metadata still uses
 * whitelist-based dispatch. This exists as an independently tested unit so
 * that swapping the route over to it (removing the whitelist) can be a
 * small, low-risk change.
 *
 * - Data API succeeds            -> return its metadata; Resource Watch is
 *                                    never queried.
 * - Data API reports not-found   -> try Resource Watch.
 *     - Resource Watch succeeds  -> return its metadata.
 *     - Resource Watch also
 *       reports not-found        -> throw MetadataNotFoundError.
 * - Data API fails for any other
 *   reason (timeout, 5xx, auth)  -> rethrow immediately. Resource Watch is
 *                                    never queried: fallback is specifically
 *                                    a not-found resolution strategy, not a
 *                                    generic recovery strategy.
 */
export const resolveMetadata = async (key) => {
  try {
    return await getDataApiMetadata(key);
  } catch (error) {
    if (!(error instanceof MetadataNotFoundError)) {
      throw error;
    }
  }

  return getResourceWatchMetadata(key);
};
