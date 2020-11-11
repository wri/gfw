import { createSelector, createStructuredSelector } from 'reselect';
import bbox from 'turf-bbox';
import bboxPolygon from 'turf-bbox-polygon';
import area from 'turf-area';

const getInteractionData = (state, { selected }) => selected;
const getMap = (state, { map }) => map;

export const getTableData = createSelector(
  [getInteractionData],
  (interaction = {}) => {
    const { data, layer, isBoundary } = interaction;
    const { interactionConfig } = layer || {};
    if (isBoundary && interactionConfig) {
      return interactionConfig.output.reduce(
        (obj, c) => ({
          ...obj,
          [c.column]: data[c.column],
        }),
        {}
      );
    }

    return (
      interactionConfig &&
      interactionConfig.output &&
      interactionConfig.output
        .filter((c) => !c.hidden)
        .map((c) => ({
          ...c,
          label: c.property,
          value: data[c.column],
        }))
    );
  }
);

export const getShouldZoomToShape = createSelector(
  [getInteractionData, getMap],
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
    const shapeBbox = geometry && bbox(geometry);
    const shapePolygon = shapeBbox && bboxPolygon(shapeBbox);
    // get bbox of map
    const mapBounds = map.getBounds();
    const mapPolygon = bboxPolygon([
      mapBounds._sw.lng,
      mapBounds._sw.lat,
      mapBounds._ne.lng,
      mapBounds._ne.lat,
    ]);
    // compare size
    const shapeArea = shapePolygon && area(shapePolygon);
    const mapArea = shapePolygon && area(mapPolygon);
    const ratio = shapeArea / mapArea;

    return ratio < 0.25;
  }
);

export const getDataTableProps = createStructuredSelector({
  data: getTableData,
  zoomToShape: getShouldZoomToShape,
});
