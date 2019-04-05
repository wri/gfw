import axios from 'axios';

import { getSoilOrganicCarbon, getBiomassRanking } from 'services/climate';

export default ({ params }) =>
  axios
    .all([
      getSoilOrganicCarbon({ ...params }),
      getBiomassRanking({ ...params })
    ])
    .then(
      axios.spread((soilOrganicCarbon, aboveGroundBiomass) => ({
        soilCarbon: soilOrganicCarbon.data.rows.find(
          r => r.iso === params.adm0
        ),
        aboveGround: aboveGroundBiomass.data.rows.find(
          r => r.iso === params.adm0
        )
      }))
    );
