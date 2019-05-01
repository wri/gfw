import request from 'utils/request';

const { TRASE_API } = process.env;

export const fetchTraseContexts = () =>
  request.get(
    `${TRASE_API}/contexts`
  );

export const fetchTraseLocationData = (contextId, columnId) =>
  request.get(
    `${TRASE_API}/contexts/${contextId}/top_nodes?column_id=${columnId}`
  );
