/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import finallyShim from 'promise.prototype.finally';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import useStore from 'redux/store';
import { rootReducer } from 'fast-redux';
import isEmpty from 'lodash/isEmpty';

import { trackEvent } from 'utils/analytics';
import reducerRegistry from 'redux/registry';

import 'styles/styles.scss';

// COMPONENTS
//analysis
import '../components/analysis/styles.scss';
import '../components/analysis/components/chose-analysis/styles.scss';
import '../components/analysis/components/download-data/styles.scss';
import '../components/analysis/components/show-analysis/styles.scss';

// aoi-card
import '../components/aoi-card/styles.scss';

// basemaps
import '../components/basemaps/styles.scss';
import '../components/basemaps/basemap-button/styles.scss';
import '../components/basemaps/basemaps-menu/styles.scss';

// charts
import '../components/charts/brush-chart/styles.scss';
import '../components/charts/components/chart-legend/styles.scss';
import '../components/charts/components/chart-tooltip/styles.scss';
import '../components/charts/components/pie-chart-legend/styles.scss';
import '../components/charts/composed-chart/styles.scss';
import '../components/charts/horizontal-bar-chart/styles.scss';
import '../components/charts/lollipop-chart/styles.scss';
import '../components/charts/pie-chart/styles.scss';
import '../components/charts/sankey-chart/styles.scss';
import '../components/charts/sankey-chart/sankey-link/styles.scss';
import '../components/charts/sankey-chart/sankey-node/styles.scss';
import '../components/charts/sankey-chart/sankey-tooltip/styles.scss';

// confirmation message
import '../components/confirmation-message/styles.scss';

// cover
import '../components/cover/styles.scss';

// error-message
import '../components/error-message/styles.scss';

//footer
import '../components/footer/styles.scss';

//forms
import '../components/forms/area-of-interest/styles.scss';
import '../components/forms/area-of-interest/webhook-modal/styles.scss';
import '../components/forms/components/checkbox/styles.scss';
import '../components/forms/components/error/styles.scss';
import '../components/forms/components/field-wrapper/styles.scss';
import '../components/forms/components/input/styles.scss';
import '../components/forms/components/input-tags/styles.scss';
import '../components/forms/components/radio/styles.scss';
import '../components/forms/components/select/styles.scss';
import '../components/forms/components/submit/styles.scss';
import '../components/forms/contact/styles.scss';
import '../components/forms/login/styles.scss';
import '../components/forms/newsletter/styles.scss';
import '../components/forms/profile/styles.scss';

//header
import '../components/header/styles.scss';

import '../components/map/styles.scss';

//map geostore
import '../components/map-geostore/styles.scss';

// map-menu
import '../components/map-menu/styles.scss';

// modals
import '../components/modals/area-of-interest/styles.scss';
import '../components/modals/climate/styles.scss';
import '../components/modals/confirm-subscription/styles.scss';
import '../components/modals/contact-us/styles.scss';
import '../components/modals/fires/styles.scss';
import '../components/modals/meta/styles.scss';
import '../components/modals/profile/styles.scss';
import '../components/modals/share/styles.scss';
import '../components/modals/video/styles.scss';
import '../components/modals/welcome/styles.scss';

// numbered-list
import '../components/numbered-list/styles.scss';

// paginate
import '../components/paginate/styles.scss';

// import '../components/prompts/styles.scss';
// import '../components/recent-imagery/styles.scss';
import '../components/satellite-basemaps/styles.scss';

// sentence selector
import '../components/sentence-selector/styles.scss';

// statement
import '../components/statement/styles.scss';

// subnav-menu
import '../components/subnav-menu/styles.scss';
import '../components/subnav-menu/themes/subnav-dark.scss';
import '../components/subnav-menu/themes/subnav-plain.scss';
import '../components/subnav-menu/themes/subnav-small-light.scss';

// success message
import '../components/success-message/styles.scss';

// tags list
import '../components/tags-list/styles.scss';

// UI
import '../components/ui/button/styles.scss';
import '../components/ui/button/themes/button-light.scss';
import '../components/ui/button/themes/button-small.scss';
import '../components/ui/button/themes/button-xsmall.scss';
import '../components/ui/button/themes/button-medium.scss';
import '../components/ui/button/themes/button-tiny.scss';
import '../components/ui/button/themes/button-grey.scss';
import '../components/ui/button/themes/button-grey-filled.scss';
import '../components/ui/button/themes/button-clear.scss';
import '../components/ui/button/themes/button-map-control.scss';
import '../components/ui/button/themes/button-dashed.scss';
import '../components/ui/button/themes/button-dark-round.scss';
import '../components/ui/button/themes/button-inline.scss';
import '../components/ui/button/themes/button-full-width.scss';

import '../components/ui/card/styles.scss';
import '../components/ui/card/themes/card-small.scss';
import '../components/ui/card/themes/card-dark.scss';

import '../components/ui/checkbox/styles.scss';
import '../components/ui/datepicker/styles.scss';
import '../components/ui/datepicker/datepicker-header/styles.scss';

import '../components/ui/dropdown/styles.scss';
import '../components/ui/dropdown/components/item/styles.scss';
import '../components/ui/dropdown/components/menu/styles.scss';
import '../components/ui/dropdown/components/selector/styles.scss';
import '../components/ui/dropdown/themes/dropdown-dark.scss';
import '../components/ui/dropdown/themes/dropdown-light.scss';
import '../components/ui/dropdown/themes/dropdown-button.scss';
import '../components/ui/dropdown/themes/dropdown-button-small.scss';
import '../components/ui/dropdown/themes/dropdown-button-big.scss';
import '../components/ui/dropdown/themes/dropdown-native.scss';
import '../components/ui/dropdown/themes/dropdown-native-button.scss';
import '../components/ui/dropdown/themes/dropdown-native-button-green.scss';
import '../components/ui/dropdown/themes/dropdown-native-plain.scss';
import '../components/ui/dropdown/themes/dropdown-native-inline.scss';
import '../components/ui/dropdown/themes/dropdown-native-form.scss';
import '../components/ui/dropdown/themes/dropdown-dark-round.scss';
import '../components/ui/dropdown/themes/dropdown-dark-squared.scss';
import '../components/ui/dropdown/themes/dropdown-no-border.scss';
import '../components/ui/dropdown/themes/dropdown-full-width.scss';
import '../components/ui/dropdown/themes/dropdown-native-label-inline.scss';

import '../components/ui/dynamic-sentence/styles.scss';
import '../components/ui/icon/styles.scss';

import '../components/ui/loader/styles.scss';
import '../components/ui/loader/themes/loader-light.scss';

import '../components/ui/map/styles.scss';
import '../components/ui/no-content/styles.scss';
import '../components/ui/pill/styles.scss';
import '../components/ui/refresh-button/styles.scss';

import '../components/ui/search/styles.scss';
import '../components/ui/search/themes/search-small.scss';

import '../components/ui/switch/styles.scss';
import '../components/ui/switch/react-toggle.scss';
import '../components/ui/switch/themes/switch-light.scss';

import '../components/ui/timeframe/styles.scss';
import '../components/ui/tip/styles.scss';

import '../components/ui/toggle/styles.scss';
import '../components/ui/toggle/themes/large.scss';

import '../components/ui/vertical-menu/styles.scss';

// widget
import '../components/widget/styles.scss';
import '../components/widget/components/widget-body/styles.scss';
import '../components/widget/components/widget-caution/styles.scss';
import '../components/widget/components/widget-chart-and-list/styles.scss';
import '../components/widget/components/widget-chart-list/styles.scss';
import '../components/widget/components/widget-footer/styles.scss';
import '../components/widget/components/widget-header/styles.scss';
import '../components/widget/components/widget-header/components/widget-download-button/styles.scss';
import '../components/widget/components/widget-header/components/widget-map-button/styles.scss';
import '../components/widget/components/widget-header/components/widget-settings/styles.scss';
import '../components/widget/components/widget-header/components/widget-settings-button/styles.scss';
import '../components/widget/components/widget-list-legend/styles.scss';
import '../components/widget/components/widget-lollipop/styles.scss';
import '../components/widget/components/widget-map-list/styles.scss';
import '../components/widget/components/widget-pie-chart-legend/styles.scss';
import '../components/widget/components/widget-sankey/styles.scss';
import '../components/widget/components/widgets-custom/carbon-flux/styles.scss';

//world map
import '../components/world-map/style.scss';

//LAYOUTS
import '../layouts/home/styles.scss';
import '../layouts/404/styles.scss';
import '../layouts/error/styles.scss';

// WRAPPERS
import '../wrappers/cookies/styles.scss';
import '../wrappers/page/styles.scss';
import '../wrappers/static/styles.scss';

finallyShim.shim();

// fixes dev mode css modules not being added to the document correctly between
// route changes due to a conflict between mini-css-extract-plugin and HMR
// https://github.com/sheerun/extracted-loader/issues/11#issue-453094382
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.addStatusHandler((status) => {
    if (typeof window !== 'undefined' && status === 'ready') {
      window.__webpack_reload_css__ = true;
    }
  });
}

const App = ({ Component, pageProps }) => {
  const store = useStore();

  useMemo(() => {
    const reducers = reducerRegistry.getReducers();
    store.replaceReducer(
      isEmpty(reducers)
        ? rootReducer
        : combineReducers(reducerRegistry.getReducers())
    );
  });

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export function reportWebVitals({ id, name, label, value }) {
  trackEvent({
    action: name,
    category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    label: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  });
}

export default App;
