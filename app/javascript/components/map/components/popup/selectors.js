import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import bbox from 'turf-bbox';
import bboxPolygon from 'turf-bbox-polygon';
import area from 'turf-area';
import lineString from 'turf-linestring';

import {
  getActiveDatasetsFromState,
  filterInteractions,
  getSelectedInteraction
} from 'components/map/selectors';

const getSearch = state => state.location && state.location.search;
const getLatLng = state =>
  state.map &&
  state.map.data &&
  state.map.data.interactions &&
  state.map.data.interactions.latlng;
const getMap = (state, { map }) => map;

export const getIsBoundary = createSelector(
  getSelectedInteraction,
  interaction =>
    interaction && interaction.layer && interaction.layer.isBoundary
);

export const getShouldZoomToShape = createSelector(
  [getSelectedInteraction, getMap],
  (selected, map) => {
    if (!selected) return null;
    if (map.getZoom() > 12) return false;

    const { data, layer, geometry } = selected;
    const { cartodb_id, wdpaid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};

    const isAdmin = analysisEndpoint === 'admin';
    const isWdpa = analysisEndpoint === 'wdpa' && (cartodb_id || wdpaid);
    const isUse = cartodb_id && tableName;

    if (isAdmin || isWdpa || isUse) return false;

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

    return ratio < 0.25;
  }
);

export const getCardData = createSelector(
  [getSelectedInteraction],
  interaction => {
    if (isEmpty(interaction) || !interaction.article) {
      return null;
    }
    const { data, layer } = interaction;
    const { interactionConfig } = layer || {};
    const articleData =
      interactionConfig &&
      interactionConfig.output &&
      interactionConfig.output.reduce((obj, param) => {
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

    let newBbox = data.bbox && JSON.parse(data.bbox).coordinates[0];
    if (newBbox) {
      const bboxCoords = newBbox.slice(0, 4);
      newBbox = bbox(lineString(bboxCoords));
    }

    return {
      ...articleData,
      ...(bbox && {
        bbox: newBbox
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
  zoomToShape: getShouldZoomToShape
});
