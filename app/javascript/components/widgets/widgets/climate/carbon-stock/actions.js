import axios from 'axios';

import { getSoilOrganicCarbon, getBiomassRanking } from 'services/climate';

export default ({ params }) =>
  axios
    .all([
      getSoilOrganicCarbon({ ...params }),
      getBiomassRanking({ ...params })
    ])
    .then(
      axios.spread((soilOrganicCarbon, aboveGroundBiomass) => {
        let level = 'iso';
        let paramLevel = 'adm0';
        if (params.adm1) {
          level = 'admin_1';
          paramLevel = 'adm1';
        } else if (params.adm2) {
          paramLevel = 'adm2';
        }

        return {
          soilCarbon: soilOrganicCarbon.data.rows.find(
            r => r[level] === params[paramLevel]
          ),
          aboveGround: aboveGroundBiomass.data.rows.find(
            r => r[level] === params[paramLevel]
          )
        };
      })
    );
