import axios from 'axios';
import { getEmissions } from 'services/climate';

export const getData = ({ params }) =>
  axios.all([...getEmissions({ ...params })]).then(
    axios.spread(
      (
        cYSF,
        cMASF,
        cPasture,
        cCrops,
        co2YSF,
        co2MASF,
        co2Pasture,
        co2Crops
      ) => {
        const data = {
          cGain: {
            YSF: cYSF.data && cYSF.data.rows,
            MASF: cMASF.data && cMASF.data.rows,
            Pasture: cPasture.data && cPasture.data.rows,
            Crops: cCrops.data && cCrops.data.rows
          },
          co2Gain: {
            YSF: co2YSF.data && co2YSF.data.rows,
            MASF: co2MASF.data && co2MASF.data.rows,
            Pasture: co2Pasture.data && co2Pasture.data.rows,
            Crops: co2Crops.data && co2Crops.data.rows
          }
        };
        return data;
      }
    )
  );

export const getDataURL = params => [
  ...getEmissions({ ...params, download: true })
];

export default getData;
