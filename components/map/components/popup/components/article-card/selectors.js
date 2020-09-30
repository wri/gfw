import { createSelector, createStructuredSelector } from 'reselect';
import lineString from 'turf-linestring';
import bbox from 'turf-bbox';

const getInteractionData = (state, { data }) => data;

export const getCardData = createSelector(
  [getInteractionData],
  (interaction = {}) => {
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
            value &&
            value !== 'null' && {
              [renderKey]: `${prefix || ''}${value}`,
            }),
        };
        return newObj;
      }, {});
    const { readMoreLink } = articleData || {};

    const buttons = readMoreLink
      ? [
          {
            text: 'READ MORE',
            extLink: readMoreLink,
            theme: `theme-button-small ${
              data.bbox ? 'theme-button-light' : ''
            }`,
          },
        ]
      : [];

    if (data.bbox) {
      buttons.push({
        text: 'ZOOM',
        theme: 'theme-button-small',
      });
    }

    let newBbox = data.bbox && JSON.parse(data.bbox).coordinates[0];
    if (newBbox) {
      const bboxCoords = newBbox.slice(0, 4);
      newBbox = bbox(lineString(bboxCoords));
    }

    const meta = customMeta && customMeta[data.type];

    return {
      ...articleData,
      ...(articleData.tag &&
        meta && {
          tag: meta.label,
          tagColor: (meta && meta.color) || layer.color,
        }),
      ...(!articleData.title &&
        meta && {
          title: `Place to Watch: ${meta.label}`,
        }),
      ...(!articleData.summary &&
        meta && {
          summary: `This location is likely in non-compliance with company no-deforestation commitments if cleared for or planted with ${meta.label}.`,
          showFullSummary: true,
        }),
      ...(bbox && {
        bbox: newBbox,
      }),
      buttons,
    };
  }
);

export const getArticleCardProps = createStructuredSelector({
  data: getCardData,
});
