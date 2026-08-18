import { GFW_METADATA_API, GFW_STAGING_METADATA_API } from 'utils/apis';
import { MetadataNotFoundError } from './errors';

const ENVIRONMENT = process.env.NEXT_PUBLIC_FEATURE_ENV;
const GFW_METADATA_API_URL =
  ENVIRONMENT === 'staging' ? GFW_STAGING_METADATA_API : GFW_METADATA_API;

/**
 * Resolves metadata for a key against Resource Watch's gfw-metadata service.
 *
 * Owns everything specific to that backend so callers don't need to:
 * - production/staging endpoint selection
 * - the no-cache request headers and cache-busting query param it requires
 * - Resource Watch's unusual "not found" signal: an HTTP 200 response with
 *   an { error: ... } body instead of a real error status
 * - normalizing the payload into the shared { metadata } contract
 *
 * Throws MetadataNotFoundError when Resource Watch reports (via a 404, or
 * via its 200 + { error } quirk) that the key doesn't exist. Any other
 * failure is thrown as a plain Error representing an upstream failure.
 */
export const getResourceWatchMetadata = async (key) => {
  const url = `${GFW_METADATA_API_URL}/${key}/?_=${Date.now()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      'If-None-Match': '',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new MetadataNotFoundError(
        `No Resource Watch metadata found for "${key}"`
      );
    }
    throw new Error(
      `Resource Watch metadata request failed with status ${response.status}`
    );
  }

  const data = await response.json();

  // Resource Watch signals "key not found" with an HTTP 200 and an
  // { error: ... } body rather than a real error status. Treat that shape
  // the same as a 404 so callers get one consistent not-found signal instead
  // of a payload that looks like metadata but isn't.
  if (data && typeof data === 'object' && 'error' in data) {
    throw new MetadataNotFoundError(
      `Resource Watch reported no metadata for "${key}": ${data.error}`
    );
  }

  return { metadata: data };
};
