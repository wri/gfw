import {
  MINING_CONCESSIONS_DATASET,
  PROTECTED_AREAS_DATASET,
  // TIGER_CONSERVATION_LANDSCAPES_DATASET,
  ALLIANCE_FOR_ZERO_EXSTINCTION_DATASET,
  INDIGENOUS_AND_COMMUNITY_LANDS_DATASET,
  IND_PEAT_LANDS_DATASET,
  IND_FOREST_MAMATORIUM_DATASET,
  OIL_PALM_DATASET,
  WOOD_FIBER_DATASET,
  LOGGING_CONCESSIONS_DATASET,
} from 'data/datasets';
import {
  MINING_CONCESSIONS,
  PROTECTED_AREAS_LAYER,
  // TIGER_CONSERVATION_LANDSCAPES,
  ALLIANCE_FOR_ZERO_EXSTINCTION,
  INDIGENOUS_AND_COMMUNITY_LANDS,
  IND_PEAT_LANDS,
  IND_FOREST_MAMATORIUM,
  OIL_PALM,
  WOOD_FIBER,
  LOGGING_CONCESSIONS,
} from 'data/layers';

export default [
  {
    label: 'Mining concessions',
    value: 'mining',
    dataType: 'keyword',
    metaKey: 'gfw_mining',
    tableKey: 'is__gfw_mining_concessions',
    global: true,
    datasets: [
      {
        dataset: MINING_CONCESSIONS_DATASET,
        layers: [MINING_CONCESSIONS],
      },
    ],
  },
  {
    label: 'Protected Areas',
    value: 'wdpa',
    dataType: 'keyword',
    metaKey: 'wdpa_protected_areas',
    tableKey: 'wdpa_protected_areas__iucn_cat',
    global: true,
    categories: ['Category Ia/b or II', 'Other Category', 'Unkown'],
    datasets: [
      {
        dataset: PROTECTED_AREAS_DATASET,
        layers: [PROTECTED_AREAS_LAYER],
      },
    ],
  },
  {
    label: 'Key Biodiversity Areas',
    preserveString: true,
    dataType: 'keyword',
    value: 'kba',
    metaKey: 'key_biodiversity_areas',
    tableKey: 'is__birdlife_key_biodiversity_areas',
    global: true,
  },
  // {
  //   label: 'Tiger Conservation Landscapes',
  //   value: 'tiger_cl',
  //   dataType: 'keyword',
  //   metaKey: 'tiger_conservation_landscapes',
  //   tableKey: 'is__gfw_tiger_landscape',
  //   global: true,
  //   datasets: [
  //     {
  //       dataset: TIGER_CONSERVATION_LANDSCAPES_DATASET,
  //       layers: [TIGER_CONSERVATION_LANDSCAPES],
  //     },
  //   ]
  // },
  {
    label: 'Alliance for Zero Extinction sites',
    value: 'aze',
    dataType: 'keyword',
    preserveString: true,
    metaKey: 'alliance_for_zero_extinction_sites',
    tableKey: 'is__birdlife_alliance_for_zero_extinction_sites',
    global: true,
    datasets: [
      {
        dataset: ALLIANCE_FOR_ZERO_EXSTINCTION_DATASET,
        layers: [ALLIANCE_FOR_ZERO_EXSTINCTION],
      },
    ],
  },
  {
    label: 'Indigenous and Community Lands',
    preserveString: true,
    value: 'landmark',
    dataType: 'keyword',
    metaKey: 'landmark_icls_2020',
    tableKey: 'is__landmark_indigenous_and_community_lands',
    global: true,
    datasets: [
      {
        dataset: INDIGENOUS_AND_COMMUNITY_LANDS_DATASET,
        layers: [INDIGENOUS_AND_COMMUNITY_LANDS],
      },
    ],
  },
  {
    label: 'Indonesia & Malaysia peat lands',
    preserveString: true,
    dataType: 'keyword',
    value: 'idn_mys_peatlands',
    metaKey: 'idn_peat_lands',
    tableKey: 'is__gfw_peatlands',
    global: false,
    datasets: [
      {
        dataset: IND_PEAT_LANDS_DATASET,
        layers: [IND_PEAT_LANDS],
      },
    ],
    hidden: true, // FIXME: we are temporary hiding this option until further notice, see FLAG-827 for reference.
  },
  {
    label: 'Indonesia forest moratorium areas',
    preserveString: true,
    dataType: 'number',
    value: 'idn_forest_moratorium',
    metaKey: 'idn_forest_moratorium',
    tableKey: 'is__idn_forest_moratorium',
    global: false,
    datasets: [
      {
        dataset: IND_FOREST_MAMATORIUM_DATASET,
        layers: [IND_FOREST_MAMATORIUM],
      },
    ],
  },
  {
    label: 'Oil palm concessions',
    value: 'oil_palm',
    dataType: 'keyword',
    metaKey: 'gfw_oil_palm',
    tableKey: 'is__gfw_oil_palm',
    global: true,
    datasets: [
      {
        dataset: OIL_PALM_DATASET,
        layers: [OIL_PALM],
      },
    ],
  },
  {
    label: 'Wood fiber concessions',
    value: 'wood_fiber',
    dataType: 'keyword',
    metaKey: 'gfw_wood_fiber',
    tableKey: 'is__gfw_wood_fiber',
    global: true,
    datasets: [
      {
        dataset: WOOD_FIBER_DATASET,
        layers: [WOOD_FIBER],
      },
    ],
  },
  {
    label: 'Logging concessions',
    value: 'managed_forests',
    dataType: 'keyword',
    metaKey: 'gfw_logging',
    tableKey: 'is__gfw_managed_forests',
    global: true,
    datasets: [
      {
        dataset: LOGGING_CONCESSIONS_DATASET,
        layers: [LOGGING_CONCESSIONS],
      },
    ],
  },
];
