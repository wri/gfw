import { createSelector, createStructuredSelector } from 'reselect';
import bbox from 'turf-bbox';
import bboxPolygon from 'turf-bbox-polygon';
import area from 'turf-area';

import {
  getActiveDatasetsFromState,
  getInteractions,
  getInteractionSelected,
} from 'components/map/selectors';

const getLatitude = (state) => state?.map?.data?.interactions?.latlng?.lat;
const getLongitude = (state) => state?.map?.data?.interactions?.latlng?.lng;
const getMap = (state, { map }) => map;

export const getShowPopup = createSelector(
  [getLatitude, getLongitude, getInteractionSelected],
  (lat, lng, interaction) => lat && lng && !interaction?.data?.cluster
);

export const getInteractionsOptions = createSelector(
  getInteractions,
  (interactions) =>
    interactions?.map((i) => ({ label: i?.layer?.name, value: i?.layer?.id }))
);

export const getInteractionsOptionSelected = createSelector(
  getInteractionSelected,
  (selected) => ({ label: selected?.layer?.name, value: selected?.layer?.id })
);

export const getInteractionWithContext = createSelector(
  [getInteractionSelected],
  (interaction = {}) => {
    const { layer, geometry } = interaction || {};
    const isAoi = layer?.name === 'Area of Interest';
    const isArticle = !!layer?.interactionConfig?.article;
    const isBoundary = layer?.isBoundary;
    const isPoint = geometry?.type === 'Point';

    return {
      ...interaction,
      isAoi,
      isArticle,
      isBoundary,
      isPoint,
    };
  }
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
      mapBounds._ne.lat,
    ]);
    // compare size
    const shapeArea = area(shapePolygon);
    const mapArea = area(mapPolygon);
    const ratio = shapeArea / mapArea;

    return ratio < 0.25;
  }
);

export const getPopupProps = createStructuredSelector({
  latitude: getLatitude,
  longitude: getLongitude,
  showPopup: getShowPopup,
  interactionsOptions: getInteractionsOptions,
  interactionOptionSelected: getInteractionsOptionSelected,
  selected: getInteractionWithContext,
  activeDatasets: getActiveDatasetsFromState,
  zoomToShape: getShouldZoomToShape,
});
