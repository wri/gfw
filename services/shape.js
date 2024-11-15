import request from 'utils/request';

import { GFW_API, GFW_STAGING_API } from 'utils/apis';

const GFW_API_URL =
  process.env.NEXT_PUBLIC_RW_FEATURE_ENV === 'staging'
    ? GFW_STAGING_API
    : GFW_API;

const QUERIES = {
  ogrConvert: '/v2/ogr/convert',
};

export const uploadShapeFile = (
  file,
  onUploadProgress,
  onDownloadProgress,
  cancelToken
) => {
  const url = `${GFW_API_URL}/${QUERIES.ogrConvert}`;
  const formData = new FormData();
  formData.append('file', file);

  return request({
    method: 'POST',
    data: formData,
    url,
    cancelToken,
    onUploadProgress,
    onDownloadProgress,
  });
};
