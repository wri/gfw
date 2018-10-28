import { getLoss } from 'services/forest-data';

export default ({ params }) =>
  getLoss(params).then(response => {
    const loss = response.data && response.data.data;
    return loss.length ? { loss } : {};
  });
