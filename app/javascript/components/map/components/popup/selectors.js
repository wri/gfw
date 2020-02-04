import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import bbox from 'turf-bbox';
import bboxPolygon from 'turf-bbox-polygon';
import area from 'turf-area';
import lineString from 'turf-linestring';

import {
  getActiveDatasetsFromState,
  getInteractions,
  getInteractionSelected
} from 'components/map/selectors';

const getSearch = state => state.location && state.location.search;
const getLatLng = state =>
  state.map &&
  state.map.data &&
  state.map.data.interactions &&
  state.map.data.interactions.latlng;
const getMap = (state, { map }) => map;

export const getIsBoundary = createSelector(
  getInteractionSelected,
  interaction =>
    interaction && interaction.layer && interaction.layer.isBoundary
);

export const getIsArea = createSelector(
  getInteractionSelected,
  interaction => interaction && interaction.aoi
);

export const getShouldZoomToShape = createSelector(
  [getInteractionSelected, getMap],
  (selected, map) => {
    if (!selected || !map) return null;
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
  [getInteractionSelected],
  interaction => {
    if (isEmpty(interaction) || !interaction.article) {
      return null;
    }
    const { data, layer } = interaction;
    const { interactionConfig, customMeta } = layer || {};
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

    const buttons = readMoreLink
      ? [
        {
          text: 'READ MORE',
          extLink: readMoreLink,
          theme: `theme-button-small ${data.bbox ? 'theme-button-light' : ''}`
        }
      ]
      : [];

    if (data.bbox) {
      buttons.push({
        text: 'ZOOM',
        theme: 'theme-button-small'
      });
    }

    let newBbox = data.bbox && JSON.parse(data.bbox).coordinates[0];
    if (newBbox) {
      const bboxCoords = newBbox.slice(0, 4);
      newBbox = bbox(lineString(bboxCoords));
    }

    const splitGridId = data && data.grid_id && data.grid_id.split('_');
    const locationFromGridId =
      splitGridId &&
      `${splitGridId[0]}${splitGridId[2] ? `, ${splitGridId[2]}` : ''}`;
    const meta = customMeta && customMeta[data.type];
    const locationName = locationFromGridId.toUpperCase();

    return {
      ...articleData,
      ...(articleData.tag &&
        meta && {
        tag: meta.label,
        tagColor: (meta && meta.color) || layer.color
      }),
      ...(!articleData.title &&
        meta && {
        title: `Place to Watch: ${meta.label}`
      }),
      ...(!articleData.summary &&
        locationFromGridId &&
        meta && {
        summary: `FOREST CLEARING IN ${
          locationName === 'SEA' ? 'SE Asia' : locationName
        }: This location is likely in non-compliance with company no-deforestation commitments if cleared for or planted with ${
          meta.label
        }.`,
        showFullSummary: true
      }),
      ...(bbox && {
        bbox: newBbox
      }),
      buttons
    };
  }
);

export const getTableData = createSelector(
  [getInteractionSelected, getIsBoundary],
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
  interactions: getInteractions,
  selected: getInteractionSelected,
  tableData: getTableData,
  cardData: getCardData,
  latlng: getLatLng,
  activeDatasets: getActiveDatasetsFromState,
  search: getSearch,
  isBoundary: getIsBoundary,
  isArea: getIsArea,
  zoomToShape: getShouldZoomToShape
});
