import axios from 'axios';

const REQUEST_URL = process.env.GFW_API;

const QUERIES = {
  ogrConvert: '/v2/ogr/convert'
};

export const uploadShapeFile = (file, onUploadProgress) => {
  const url = `${REQUEST_URL}${QUERIES.ogrConvert}`;
  const formData = new FormData();
  formData.append('file', file);

  return axios({
    method: 'POST',
    data: formData,
    url,
    onUploadProgress
  });
};
