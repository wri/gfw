import { createSelector } from 'reselect';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import concat from 'lodash/concat';
import isEmpty from 'lodash/isEmpty';
import qs from 'query-string';

import WIDGETS from 'pages/country/data/widgets-config.json';

// get list data
const getCategories = state => state.categories || null;
const getCategory = state => state.category || null;
const getAdminLevel = state => state.adminLevel || null;
const getLocation = state => state.location || null;
const getLocationOptions = state => state.locationOptions || null;
const getIndicatorWhitelist = state => state.indicatorWhitelist || null;

// get lists selected
export const getWidgets = createSelector(
  [getCategory, getAdminLevel, getLocationOptions, getIndicatorWhitelist],
  (category, adminLevel, locationOptions, indicatorWhitelist) => {
    if (isEmpty(locationOptions) || isEmpty(indicatorWhitelist)) return null;
    const widgetKeys = Object.keys(WIDGETS);
    return widgetKeys
      .map(key => ({
        name: key,
        ...WIDGETS[key]
      }))
      .filter(widget => {
        let hasData = true;
        let hasLocations = true;
        if (widget.config.showIndicators && widget.config.indicators) {
          const totalIndicators = concat(
            widget.config.showIndicators,
            indicatorWhitelist
          ).length;
          const reducedIndicators = uniq(
            concat(widget.config.showIndicators, indicatorWhitelist)
          ).length;
          hasData = totalIndicators !== reducedIndicators;
        }
        if (widget.config.locationCheck) {
          const adminCheck =
            adminLevel === 'country' ? 'regions' : 'subRegions';
          hasLocations =
            locationOptions[adminCheck] &&
            locationOptions[adminCheck].length > 1;
        }

        return (
          widget.config.categories.indexOf(category) > -1 &&
          widget.config.admins.indexOf(adminLevel) > -1 &&
          hasLocations &&
          hasData &&
          widget.active
        );
      });
  }
);

export const getLinks = createSelector(
  [getCategories, getCategory, getLocation],
  (categories, activeCategory, location) =>
    categories.map(category => {
      const locationUrl = compact(
        Object.keys(location.payload).map(key => location.payload[key])
      ).join('/');
      const newQuery = {
        ...location.query,
        category: category.value
      };
      return {
        label: category.label,
        path: `/country/${locationUrl}?${qs.stringify(newQuery)}`,
        active: activeCategory === category.value
      };
    })
);
