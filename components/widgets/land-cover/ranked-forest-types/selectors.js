import { createSelector, createStructuredSelector } from 'reselect';
import { formatNumber } from 'utils/format';
import maxBy from 'lodash/maxBy';

import ipccClasses from './ipcc-classes.json';

const getData = (state) => state.data;
const getIndicator = (state) => state.indicator;
const getSettings = (state) => state.settings;
const getLocation = (state) => state.locationLabel;
const getSentences = (state) => state.sentences;

export const parseSentence = createSelector(
  [getSentences, getIndicator, getLocation, getSettings, getData],
  (sentences, indicator, location, settings, data) => {
    // We need to do this, or the widget will be empty instead of showing the
    // "No data in selection for {location}" message
    if (!data?.length) return null;

    const { extentYear, decile } = settings;
    const sentence = indicator ? sentences.withIndicator : sentences.default;

    const params = {
      location,
      extentYear,
      indicator: indicator?.label,
      canopyCover: `>${decile}% tree cover`,
    };
    return {
      sentence,
      params,
    };
  }
);

export const parseData = createSelector([getData], (data) => {
  if (!data?.length) return null;

  const totalExtent = data.reduce(
    (acc, { wri_tropical_tree_cover_extent__ha: treeCoverExtent }) =>
      acc + treeCoverExtent,
    0
  );

  const ipccClassesDetails = ipccClasses.map(({ icon, label, ipccClass }) => {
    const dataEntry = data.find(
      (entry) => entry.umd_global_land_cover__ipcc_class === ipccClass
    );

    const extentPercent =
      ((dataEntry?.wri_tropical_tree_cover_extent__ha || 0) * 100) /
      totalExtent;

    const extentHa = dataEntry?.wri_tropical_tree_cover_extent__ha || 0;

    return {
      icon,
      label,
      // extentPercent is not needed for the infoList; we'll use it to mitigate percentage
      // sum above 100% later on.
      extentPercent: Number(
        formatNumber({
          num: extentPercent,
          specialSpecifier: '.2r',
        })
      ),
      text: `${formatNumber({
        num: extentPercent,
        unit: '%',
      })}`,
      subText: `(${formatNumber({
        num: extentHa,
        unit: 'ha',
        spaceUnit: true,
      })})`,
    };
  });

  // Due to rounding errors, we may end up with a sum of percentages way higher than 100%.
  // Given our use of 'd3-format' to make numbers more readable, a perfect 100% is neigh impossible.
  // What we can do, is mitigate it by finding the highest number and take out the extra percentage
  // from it. We will be below 100% instead, which is less jarring.
  const percentagesSum = ipccClassesDetails.reduce(
    (acc, entry) => acc + (entry?.extentPercent || 0),
    0
  );

  if (percentagesSum > 100) {
    const extraPercentage = percentagesSum - 100;
    const highestPercentEntry = maxBy(ipccClassesDetails, 'extentPercent');

    highestPercentEntry.text = formatNumber({
      num: highestPercentEntry.extentPercent - extraPercentage,
      unit: '%',
      specialSpecifier: '.2r',
    });
  }

  // Return only the properties the infoList actually needs, to prevent future confusion.
  return ipccClassesDetails.map(({ icon, label, text, subText }) => ({
    icon,
    label,
    text,
    subText,
  }));
});

export default createStructuredSelector({
  sentence: parseSentence,
  data: parseData,
});
