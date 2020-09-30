import { createSelector, createStructuredSelector } from 'reselect';
import upperFirst from 'lodash/upperFirst';

const getInteractionData = (state, { data }) => data;

export const getSentence = createSelector(
  [getInteractionData],
  ({ data } = {}) => {
    const { context, text, category } = data || {};
    const contextLocation = context?.map((c) => c.text).join(', ');
    const firstCategory = upperFirst(category?.split(', ')?.[0]);
    const sentenceTemplate = firstCategory
      ? '{category} in {contextLocation}'
      : `{contextLocation}`;

    return {
      title: text,
      sentence: sentenceTemplate,
      params: {
        category: firstCategory,
        contextLocation,
      },
    };
  }
);

export const getBoundarySentenceProps = createStructuredSelector({
  data: getSentence,
});
