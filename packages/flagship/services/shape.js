import { apiRequest } from 'utils/request';

const QUERIES = {
  ogrConvert: '/v2/ogr/convert'
};

export const uploadShapeFile = (
  file,
  onUploadProgress,
  onDownloadProgress,
  cancelToken
) => {
  const url = `${QUERIES.ogrConvert}`;
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest({
    method: 'POST',
    data: formData,
    url,
    cancelToken,
    onUploadProgress,
    onDownloadProgress
  });
};
