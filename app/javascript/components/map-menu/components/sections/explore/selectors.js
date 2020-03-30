import { createSelector, createStructuredSelector } from 'reselect';
import bbox from 'turf-bbox';
import lineString from 'turf-linestring';

import {
  getActiveDatasetsFromState,
  getBasemap
} from 'components/map/selectors';

import {
  POLITICAL_BOUNDARIES_DATASET,
  GLAD_DEFORESTATION_ALERTS_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  GLAD_ALERTS,
  PLACES_TO_WATCH
} from 'data/layers';

import { descriptions, topics, stories } from './sections';

const types = {
  mongabay: {
    label: 'mongabay reporting',
    color: '#D53369'
  },
  soy: {
    label: 'soy',
    color: '#1b6e03'
  },
  palm: {
    label: 'Oil palm',
    color: '#ff4a00'
  }
};

const selectSection = (state, { exploreType }) => exploreType;
const selectPTWType = (state, { ptwType }) => ptwType;
const selectPTWLoading = state => state.ptw && state.ptw.loading;
const selectPTWData = state => {
  const { data } = state.ptw || {};

  return (
    data &&
    data.map(d => {
      const bboxCoords = d.bbox.slice(0, 4);
      const bboxFromCoords = bbox(lineString(bboxCoords));
      const reverseBbox = [
        bboxFromCoords[1],
        bboxFromCoords[0],
        bboxFromCoords[3],
        bboxFromCoords[2]
      ];

      const meta = types[d.type];

      return {
        tag: meta.label,
        type: d.type,
        tagColor: meta.color,
        id: d.cartodb_id,
        image: d.image,
        imageCredit: d.image_source,
        title: d.name || `Place to Watch: ${meta.label}`,
        summary:
          d.description ||
          `This location is likely in non-compliance with company no-deforestation commitments if cleared for or planted with ${
            meta.label
          }.`,
        showFullSummary: true,
        buttons: d.link
          ? [
            {
              text: 'READ MORE',
              extLink: d.link,
              theme: 'theme-button-light theme-button-small'
            },
            {
              text: 'VIEW ON MAP',
              theme: 'theme-button-small'
            }
          ]
          : [
            {
              text: 'VIEW ON MAP',
              theme: 'theme-button-small'
            }
          ],
        payload: {
          mergeQuery: true,
          map: {
            datasets: [
              // admin boundaries
              {
                dataset: POLITICAL_BOUNDARIES_DATASET,
                layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
                opacity: 1,
                visibility: true
              },
              // GLADs
              {
                dataset: GLAD_DEFORESTATION_ALERTS_DATASET,
                layers: [PLACES_TO_WATCH, GLAD_ALERTS],
                opacity: 1,
                visibility: true
              }
            ],
            bbox: reverseBbox,
            basemap: {
              value: 'default'
            },
            label: 'default'
          }
        }
      };
    })
  );
};

const filterPTWData = createSelector(
  [selectPTWData, selectPTWType],
  (data, type) => {
    if (!data || !data.length || type === 'all') return data;

    return data.filter(d => d.type === type);
  }
);

const selectedData = createSelector([filterPTWData], ptw => ({
  topics: Object.values(topics),
  placesToWatch: ptw,
  stories: Object.values(stories)
}));

const getCardsData = createSelector(
  [selectSection, selectedData],
  (section, data) => {
    if (!data) return null;
    return data[section];
  }
);

const getLoading = createSelector(
  [selectSection, selectPTWLoading],
  (section, ptwLoading) => {
    if (section === 'topics') return false;
    return ptwLoading;
  }
);

const getDescription = createSelector(
  [selectSection],
  section => descriptions[section]
);

const getCurrentMapPayload = createSelector(
  [getActiveDatasetsFromState, getBasemap],
  (datasets, basemap) => ({
    datasets,
    basemap
  })
);

export const mapStateToProps = createStructuredSelector({
  data: getCardsData,
  section: selectSection,
  description: getDescription,
  mapState: getCurrentMapPayload,
  loading: getLoading
});
