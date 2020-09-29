import { createSelector, createStructuredSelector } from 'reselect';

const getInteractionData = (state) => state?.data;

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

export const getDataTableProps = createStructuredSelector({
  data: getTableData,
});
