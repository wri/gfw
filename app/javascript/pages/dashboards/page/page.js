import { connect } from 'react-redux';
import replace from 'lodash/replace';

import CATEGORIES from 'data/categories.json';

import mapActions from 'components/map/map-actions';

import { filterWidgets } from 'components/widgets/selectors';
import { getLinks, getTitle } from './page-selectors';
import Component from './page-component';

const actions = { ...mapActions };

const mapStateToProps = ({ countryData, whitelists, location, map }) => {
  const category = (location.query && location.query.category) || 'summary';
  const { regionWhitelist, countryWhitelist } = whitelists;
  const widgetHash =
    window.location.hash && replace(window.location.hash, '#', '');
  const widgetAnchor = document.getElementById(widgetHash);
  const activeWidget =
    replace(window.location.hash, '#', '') ||
    (location.query && location.query.widget);
  const widgetData = {
    category,
    ...location,
    countryData,
    indicatorWhitelist: location.payload.region
      ? regionWhitelist
      : countryWhitelist
  };
  const widgets = filterWidgets(widgetData);

  return {
    showMapMobile: map.showMapMobile,
    links: getLinks({ categories: CATEGORIES, ...location, category }),
    isGeostoreLoading: countryData.isGeostoreLoading,
    category,
    widgets,
    activeWidget: activeWidget || (widgets && widgets[0] && widgets[0].name),
    widgetAnchor,
    title: getTitle({ countries: countryData.countries, ...location }),
    ...location,
    ...countryData
  };
};

export default connect(mapStateToProps, actions)(Component);
