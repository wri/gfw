import axios from 'axios';
import { getCumulative } from 'services/climate';

export default ({ params }) =>
  axios.all([...getCumulative({ ...params })]).then(
    axios.spread((y2015, y2016, y2017, y2018) => ({
      2015: y2015.data && y2015.data.data,
      2016: y2016.data && y2016.data.data,
      2017: y2017.data && y2017.data.data,
      2018: y2018.data && y2018.data.data
    }))
  );
