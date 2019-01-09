import axios from 'axios';
import { getEmissions } from 'services/climate';

export default ({ params }) =>
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
            YSF: cYSF.data && cYSF.data.values,
            MASF: cMASF.data && cMASF.data.values,
            Pasture: cPasture.data && cPasture.data.values,
            Crops: cCrops.data && cCrops.data.values
          },
          co2Gain: {
            YSF: co2YSF.data && co2YSF.data.values,
            MASF: co2MASF.data && co2MASF.data.values,
            Pasture: co2Pasture.data && co2Pasture.data.values,
            Crops: co2Crops.data && co2Crops.data.values
          }
        };
        return data;
      }
    )
  );
