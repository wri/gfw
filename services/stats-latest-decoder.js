export const statsLatestDecoder = (bands) => {
  // TODO: What if we don't have bands? or max / histogram is not present?
  // i would recommend this service to simply return "null" if something is not formatted as we expect it to be
  const { max, histogram } = bands[0];

  // high confidence alerts from top-level max
  // max = abbbb where a = confidence value, bbbb = days since 2014-12-31
  const encodedMax = max.toString(10);
  const daysSinceString = encodedMax.substring(1, encodedMax.length);

  // This is always a confirmed alert
  const daysSince = parseInt(daysSinceString, 10);

  // low confidence alerts from histogram
  // need to find the last non-zero bin where where index < 30,000 (high conf)
  const binSize = (histogram.max - histogram.min) / histogram.bin_count;

  const maxBinIndex = Math.floor((30000 - histogram.min) / binSize);

  const valueBins = histogram.value_count.slice(0, maxBinIndex).reverse();

  // TODO: make sure we get a index here, and not -1, if we get -1 we should exit with "null"
  const latestIndex = valueBins.findIndex((el) => el !== 0);

  // Start of bin represents the encoded value
  const binStart = parseInt(
    histogram.min + (maxBinIndex - latestIndex) * binSize,
    10
  );

  const encodedMaxLowConfidence = binStart.toString(10);
  const daysSinceStringLowConfidence = encodedMaxLowConfidence.substring(
    1,
    encodedMaxLowConfidence.length
  );

  const daysSinceLowConfidence = parseInt(daysSinceStringLowConfidence, 10);

  // whichever is latest (i.e. most days since 2014-12-31)
  // if both are > days since
  const daysSinceArray = [daysSince, daysSinceLowConfidence];

  return Math.max(...daysSinceArray);
};
