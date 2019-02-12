import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { reverseLatLng } from 'utils/geoms';
import bbox from 'turf-bbox';
import bboxPolygon from 'turf-bbox-polygon';
import area from 'turf-area';

import {
  getActiveDatasetsFromState,
  filterInteractions,
  getSelectedInteraction
} from 'components/maps/map/selectors';

const getSearch = state => state.location && state.location.search;
const getLatLng = state => state.popup && state.popup.latlng;
const getMap = (state, { map }) => map;

export const getIsBoundary = createSelector(
  getSelectedInteraction,
  interaction =>
    interaction && interaction.layer && interaction.layer.isBoundary
);

export const getButtonState = createSelector(
  [getSelectedInteraction, getMap],
  (selected, map) => {
    if (!selected) return null;

    const { data, layer, geometry } = selected;
    const { cartodb_id, wdpaid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};

    const isAdmin = analysisEndpoint === 'admin';
    const isWdpa = analysisEndpoint === 'wdpa' && (cartodb_id || wdpaid);
    const isUse = cartodb_id && tableName;

    if (isAdmin || isWdpa || isUse) return 'ANALYZE';

    // get bbox of geometry
    const shapeBbox = bbox(geometry);
    const shapePolygon = bboxPolygon(shapeBbox);
    // get bbox of map
    const mapBounds = map.getBounds();
    const mapPolygon = bboxPolygon([
      mapBounds._sw.lng,
      mapBounds._sw.lat,
      mapBounds._ne.lng,
      mapBounds._ne.lat
    ]);
    // compare size
    const shapeArea = area(shapePolygon);
    const mapArea = area(mapPolygon);
    const ratio = shapeArea / mapArea;

    return ratio > 0.25 || map.getZoom() > 12 ? 'ANALYZE' : 'ZOOM';
  }
);

export const getCardData = createSelector(
  [getSelectedInteraction],
  interaction => {
    if (
      isEmpty(interaction) ||
      (interaction.layer && !interaction.layer.article)
    ) { return null; }
    const { data, config } = interaction;
    const articleData = config.reduce((obj, param) => {
      const { prefix, renderKey } = param;
      const value = data[param.column || param.key];
      const newObj = {
        ...obj,
        ...(renderKey &&
          value && {
            [renderKey]: `${prefix || ''}${value}`
          })
      };
      return newObj;
    }, {});
    const { readMoreLink } = articleData || {};

    const readMoreBtn = {
      text: 'READ MORE',
      extLink: readMoreLink,
      theme: `theme-button-small ${data.bbox ? 'theme-button-light' : ''}`
    };

    const buttons = data.bbox
      ? [readMoreBtn].concat([
        {
          text: 'ZOOM',
          theme: 'theme-button-small'
        }
      ])
      : [readMoreBtn];

    return {
      ...articleData,
      ...(data.bbox && {
        bbox: reverseLatLng(JSON.parse(data.bbox).coordinates[0])
      }),
      buttons
    };
  }
);

export const getTableData = createSelector(
  [getSelectedInteraction, getIsBoundary],
  (interaction, isBoundary) => {
    if (isEmpty(interaction) || interaction.article) return null;
    const { data, layer } = interaction;
    const { interactionConfig } = layer || {};
    if (isBoundary && interactionConfig) {
      return interactionConfig.output.reduce(
        (obj, c) => ({
          ...obj,
          [c.column]: data[c.column]
        }),
        {}
      );
    }

    return (
      interactionConfig &&
      interactionConfig.output &&
      interactionConfig.output.filter(c => !c.hidden).map(c => ({
        ...c,
        label: c.property,
        value: data[c.column]
      }))
    );
  }
);

export const getPopupProps = createStructuredSelector({
  interactions: filterInteractions,
  selected: getSelectedInteraction,
  tableData: getTableData,
  cardData: getCardData,
  latlng: getLatLng,
  activeDatasets: getActiveDatasetsFromState,
  search: getSearch,
  isBoundary: getIsBoundary,
  buttonState: getButtonState
});
