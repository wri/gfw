import { createSelector, createStructuredSelector } from 'reselect';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';

const getOptions = state => state.options;
const getSelected = state => state.selected;

export const getSelectedGroup = createSelector(
  [getSelected, getOptions],
  (selected, options) => {
    if (!selected) return null;
    const activeOption = options.find(o => o.value === selected.value);
    return activeOption && activeOption.group;
  }
);

export const getParsedOptions = createSelector(getOptions, options => {
  if (!options) return null;
  return groupBy(sortBy(options, 'position'), 'group');
});

export const getGroups = createSelector(getParsedOptions, options => {
  if (!options) return null;
  return Object.keys(options).map(g => ({
    label: g,
    value: options[g][0].value,
    group: g
  }));
});

export const getSecondaryOptions = createSelector(
  [getSelectedGroup, getParsedOptions],
  (group, options) => {
    if (!options || !group) return null;
    return options[group];
  }
);

export const getSelectedGroupOption = createSelector(
  [getGroups, getSelectedGroup],
  (groups, group) => {
    if (!groups || !group) return null;
    return groups.find(g => g.group === group);
  }
);

export const getSelectorProps = createStructuredSelector({
  groups: getGroups,
  options: getSecondaryOptions,
  selectedGroup: getSelectedGroupOption
});
