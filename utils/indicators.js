import forestTypes from 'data/forest-types';
import landCategories from 'data/land-categories';

export const getIndicator = (activeForestType, activeLandCategory, ifl) => {
  const forestType = forestTypes.find((f) => f.value === activeForestType);
  const landCategory = landCategories.find(
    (f) => f.value === activeLandCategory
  );
  if (!forestType && !landCategory) return null;
  let label = '';
  let value = '';
  let forestTypeLabel = (forestType && forestType.label) || '';
  let landCatLabel = (landCategory && landCategory.label) || '';

  forestTypeLabel =
    forestType && forestType.preserveString === true
      ? forestTypeLabel
      : forestTypeLabel.toLowerCase();
  landCatLabel =
    landCategory && landCategory.preserveString === true
      ? landCatLabel
      : landCatLabel.toLowerCase();

  if (forestType && landCategory) {
    label = `${forestTypeLabel} in ${landCatLabel}`;
    value = `${forestType.value}__${landCategory.value}`;
  } else if (landCategory) {
    label = landCatLabel;
    value = landCategory.value;
  } else {
    label = forestTypeLabel;
    value = forestType.value;
  }

  return {
    label: label.replace('({iflyear})', ifl),
    value,
  };
};
