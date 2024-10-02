/* eslint-disable no-unused-vars */
import { createSelector } from 'reselect';

const getData = (state) => state.data;
const getSettings = (state) => state.settings;
const getIndicator = (state) => state.indicator;
const getWhitelist = (state) => state.polynamesWhitelist;
const getColors = (state) => state.colors;
const getSentence = (state) => state.sentence;
const getTitle = (state) => state.title;
const getLocationName = (state) => state.locationLabel;
const getMetaKey = (state) => state.metaKey;
const getAdminLevel = (state) => state.adminLevel;

export const parseData = createSelector(
  [getData, getColors, getIndicator],
  (data, colors, indicator) => {}
);
