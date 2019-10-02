import { createSelector, createStructuredSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import intersection from 'lodash/intersection';
import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';
import lowerCase from 'lodash/lowerCase';
import flatMap from 'lodash/flatMap';
import moment from 'moment';
import camelCase from 'lodash/camelCase';
import qs from 'query-string';

import { getAllAreas } from 'providers/areas-provider/selectors';
import { getGeodescriberTitleFull } from 'providers/geodescriber-provider/selectors';
import { getActiveLayersWithDates } from 'components/map/selectors';

import { getIsTrase } from 'app/layouts/root/selectors';

import tropicalIsos from 'data/tropical-isos.json';
import colors from 'data/colors.json';
import { locationLevelToStr } from 'utils/format';

import {
  getSettingsConfig,
  getOptionsSelected,
  getIndicator,
  getStatements,
  getLocationPath
} from './utils/config';
import allWidgets from './manifest';

const buildLocationDict = locations =>
  location &&
  locations.length &&
  locations.reduce(
    (dict, next) => ({
      ...dict,
      [next.value || next.id]: {
        ...next
      }
    }),
    {}
  );

export const selectLocation = state => state.location && state.location.payload;
export const selectRouteType = state => state.location && state.location.type;
export const selectLocationQuery = state =>
  state.location && state.location.query;
export const selectLocationSearch = state =>
  state.location && state.location.search;
export const selectWidgetsData = state => state.widgets && state.widgets.data;
export const selectGeostore = state => state.geostore && state.geostore.data;
export const selectLoading = state =>
  state.countryData &&
  state.whitelists &&
  (state.countryData.countriesLoading ||
    state.countryData.regionsLoading ||
    state.countryData.subRegionsLoading ||
    state.whitelists.loading);
export const selectCountryData = state => state.countryData;
export const selectPolynameWhitelist = state =>
  state.whitelists && state.whitelists.data;
export const selectEmbed = (state, { embed }) => embed;
export const selectSimple = (state, { simple }) => simple;
export const selectAnalysis = (state, { analysis }) => analysis;
export const selectCategory = state =>
  state.location && state.location.query && state.location.query.category;
export const selectModalClosing = state =>
  state.modalMeta && state.modalMeta.closing;
export const selectNonGlobalDatasets = state =>
  state.widgets && state.widgets.data.nonGlobalDatasets;

export const getWidgetFromLocation = createSelector(
  [selectLocation, selectLocationQuery],
  (location, query) =>
    (location && location.widgetSlug) || (query && query.widget)
);

export const getLocation = createSelector(
  [selectLocation, selectGeostore, selectRouteType],
  (location, geostore, routeType) => {
    if (location.type === 'aoi' && geostore) {
      return {
        ...location,
        routeType,
        type: 'geostore',
        adm0: geostore.id
      };
    }

    return { ...location, routeType };
  }
);

export const getLocationObj = createSelector(
  [getLocation, getGeodescriberTitleFull],
  (location, title) => ({
    ...location,
    locationLabel: location.type === 'global' ? 'global' : title,
    adminLevel: locationLevelToStr(location),
    locationLabelFull: location.type === 'global' ? 'global' : title,
    isTropical: location && tropicalIsos.includes(location.adm0)
  })
);

export const getAllLocationData = createSelector(
  [
    selectLocation,
    selectCountryData,
    getAllAreas,
    selectRouteType,
    selectLocationQuery
  ],
  (location, countryData, areas, routeType, query) => {
    if (isEmpty(areas) && isEmpty(countryData)) return null;
    const { type, adm0, adm1 } = location;

    if (type === 'aoi') {
      return { adm0: areas.map(a => ({ ...a, value: a.geostore })) };
    }

    if (type === 'global' || type === 'country') {
      return {
        adm0: countryData.countries.map(l => ({
          ...l,
          path: getLocationPath(routeType, type, query, { adm0: l.value })
        })),
        adm1: countryData.regions.map(l => ({
          ...l,
          path: getLocationPath(routeType, type, query, { adm0, adm1: l.value })
        })),
        adm2: countryData.subRegions.map(l => ({
          ...l,
          path: getLocationPath(routeType, type, query, {
            adm0,
            adm1,
            adm2: l.value
          })
        })),
        fao: countryData.faoCountries
      };
    }

    return {};
  }
);

export const getLocationData = createSelector(
  [getLocationObj, getAllLocationData, selectPolynameWhitelist],
  (location, allLocationData, polynamesWhitelist) => {
    if (isEmpty(allLocationData)) return null;
    const { type, adminLevel, locationLabel } = location;

    let parent = {};
    let parentData = allLocationData.adm0;
    let children = allLocationData.adm0;
    if (adminLevel === 'adm0') {
      parent = { label: 'global', value: 'global' };
      children = allLocationData.adm1;
    } else if (adminLevel === 'adm1') {
      parent = allLocationData.adm0.find(d => d.value === location.adm0);
      parentData = allLocationData.adm0;
      children = allLocationData.adm2;
    } else if (adminLevel === 'adm2') {
      parent = allLocationData.adm1.find(d => d.value === location.adm1);
      parentData = allLocationData.adm1;
      children = [];
    }

    const locationData = allLocationData[adminLevel] || allLocationData.adm0;
    const currentLocation =
      locationData && locationData.find(d => d.value === location[adminLevel]);

    return {
      parent,
      parentLabel: parent && parent.label,
      parentData: parentData && buildLocationDict(parentData),
      location: currentLocation || { label: 'global', value: 'global' },
      locationData: locationData && buildLocationDict(locationData),
      locationLabel:
        type === 'geostore' || type === 'global'
          ? locationLabel
          : currentLocation && currentLocation.label,
      childData: children && buildLocationDict(children),
      polynamesWhitelist,
      status: currentLocation && currentLocation.status
    };
  }
);

export const filterWidgetsByLocation = createSelector(
  [
    getLocationObj,
    getLocationData,
    selectPolynameWhitelist,
    selectEmbed,
    getWidgetFromLocation,
    getActiveLayersWithDates,
    selectAnalysis
  ],
  (
    location,
    locationData,
    polynameWhitelist,
    embed,
    widget,
    layers,
    showAnalysis
  ) => {
    const { adminLevel, type } = location;

    const widgets = Object.values(allWidgets).map(w => ({
      ...w,
      ...(w.colors && {
        colors: colors[w.colors]
      })
    }));

    if (embed && widget) return widgets.filter(w => w.widget === widget);
    const layerIds = layers && layers.map(l => l.id);

    return widgets.filter(w => {
      const {
        types,
        admins,
        whitelists,
        blacklists,
        source,
        datasets,
        visible
      } =
        w || {};
      const { fao } = locationData || {};

      const layerIntersection =
        datasets &&
        intersection(
          compact(
            flatMap(
              datasets.filter(d => !d.boundary).map(d => {
                const layersArray = Array.isArray(d.layers) && d.layers;

                return layersArray;
              })
            )
          ),
          layerIds
        );
      const hasLocation =
        types && types.includes(type) && admins && admins.includes(adminLevel);
      const adminWhitelist =
        type === 'country' && whitelists && whitelists.adm0;

      const adminBlacklist =
        type === 'country' && blacklists && blacklists[adminLevel];
      const notInBlacklist =
        !adminBlacklist || !adminBlacklist.includes(adminLevel);

      const isFAOCountry =
        source !== 'fao' || (fao && fao.find(f => f.value === location.adm0));
      const matchesAdminWhitelist =
        !adminWhitelist || adminWhitelist.includes(location.adm0);
      const polynameIntersection =
        whitelists &&
        whitelists.indicators &&
        intersection(polynameWhitelist, whitelists.indicators);
      const matchesPolynameWhitelist =
        !whitelists ||
        !whitelists.indicators ||
        (polynameIntersection && polynameIntersection.length);

      const isWidgetVisible =
        (!showAnalysis && !visible) ||
        (showAnalysis &&
          visible &&
          visible.includes('analysis') &&
          !isEmpty(layerIntersection)) ||
        (!showAnalysis && visible && visible.includes('dashboard'));

      return (
        hasLocation &&
        matchesAdminWhitelist &&
        matchesPolynameWhitelist &&
        isFAOCountry &&
        isWidgetVisible &&
        notInBlacklist
      );
    });
  }
);

export const filterWidgetsByCategory = createSelector(
  [
    filterWidgetsByLocation,
    selectCategory,
    selectAnalysis,
    getLocationData,
    selectEmbed,
    getWidgetFromLocation
  ],
  (widgets, category, showAnalysis, locationData, embed, widget) => {
    if (isEmpty(widgets)) return null;

    if (embed && widget) return widgets.filter(w => w.widget === widget);

    if (showAnalysis || (locationData && locationData.status === 'pending')) {
      return widgets;
    }

    const cat = category || 'summary';

    return sortBy(
      widgets.filter(w => w.categories.includes(cat)),
      `sortOrder[${camelCase(cat)}]`
    );
  }
);

export const getWidgets = createSelector(
  [
    filterWidgetsByCategory,
    getLocationObj,
    getLocationData,
    selectWidgetsData,
    selectLocationQuery,
    selectLocationSearch,
    selectNonGlobalDatasets,
    getIsTrase,
    getActiveLayersWithDates,
    selectAnalysis
  ],
  (
    widgets,
    locationObj,
    locationData,
    widgetsData,
    query,
    search,
    datasets,
    isTrase,
    layers,
    analysis
  ) => {
    if (isEmpty(widgets) || !locationObj || !widgetsData) {
      return null;
    }

    const { locationLabelFull, type, adm0, adm1, adm2 } = locationObj || {};
    const { polynamesWhitelist, status } = locationData || {};

    return widgets.map(w => {
      const {
        settings: defaultSettings,
        widget,
        settingsConfig,
        pendingKeys,
        title: titleTemplate,
        dataType
      } =
        w || {};
      const rawData = widgetsData && widgetsData[widget];

      const { settings: dataSettings } = rawData || {};

      const widgetLayer =
        layers &&
        layers.find(
          l =>
            w.datasets && flatMap(w.datasets.map(d => d.layers)).includes(l.id)
        );

      const { params: layerParams, decodeParams } = widgetLayer || {};
      const startDate =
        (layerParams && layerParams.startDate) ||
        (decodeParams && decodeParams.startDate);
      const startYear =
        startDate && parseInt(moment(startDate).format('YYYY'), 10);
      const endDate =
        (layerParams && layerParams.endDate) ||
        (decodeParams && decodeParams.endDate);
      const endYear = endDate && parseInt(moment(endDate).format('YYYY'), 10);

      const widgetQuerySettings = query && query[widget];

      const layerSettings = {
        ...layerParams,
        ...decodeParams,
        ...(startYear && {
          startYear
        }),
        ...(endYear && {
          endYear
        })
      };

      const mergedSettings = {
        ...defaultSettings,
        ...dataSettings,
        ...widgetQuerySettings,
        ...(analysis && {
          ...layerSettings
        })
      };

      const settings = {
        ...mergedSettings,
        ...(mergedSettings.ifl === 2016 && {
          extentYear: 2010
        }),
        ...(mergedSettings.forestType === 'primary_forest' && {
          extentYear: 2000
        })
      };

      const dataOptions = rawData && rawData.options;

      const settingsConfigParsed = getSettingsConfig({
        settingsConfig,
        dataOptions,
        settings,
        polynamesWhitelist,
        status,
        pendingKeys
      });

      const optionsSelected =
        settingsConfigParsed && getOptionsSelected(settingsConfigParsed);

      const forestType = optionsSelected && optionsSelected.forestType;
      const landCategory = optionsSelected && optionsSelected.landCategory;
      const indicator = getIndicator(forestType, landCategory);

      const footerStatements = getStatements({
        forestType,
        landCategory,
        settings,
        datasets,
        type,
        dataType
      });

      const { ifl } = settings || {};

      const settingsConfigFiltered =
        settingsConfigParsed &&
        settingsConfigParsed.filter(
          o =>
            o.key !== 'extentYear' ||
            (ifl !== 2016 &&
              settings.forestType !== 'primary_forest' &&
              settings.forestType !== 'ifl')
        );

      const props = {
        ...w,
        ...locationObj,
        ...locationData,
        data: rawData,
        settings,
        title: titleTemplate,
        settingsConfig: settingsConfigFiltered,
        optionsSelected,
        indicator,
        showAttributionLink: isTrase,
        statements: footerStatements
      };

      const parsedProps = props.getWidgetProps && props.getWidgetProps(props);
      const { title: parsedTitle } = parsedProps || {};
      const title = parsedTitle || titleTemplate;

      const downloadLink =
        props.getDownloadLink &&
        props.getDownloadLink({ ...props, ...parsedProps });

      const searchObject = qs.parse(search);
      const widgetQuery = searchObject && searchObject[widget];
      const locationPath = `${window.location.href}`;
      const shareUrl = `${locationPath}#${widget}`;
      const embedUrl = `${window.location.origin}/embed/widget/${widget}/${
        type
      }${adm0 ? `/${adm0}` : ''}${adm1 ? `/${adm1}` : ''}${
        adm2 ? `/${adm2}` : ''
      }${widgetQuery ? `?${widget}=${widgetQuery}` : ''}`;

      return {
        ...props,
        ...parsedProps,
        shareUrl,
        embedUrl,
        downloadLink,
        title: title
          ? title.replace('{location}', locationLabelFull || '...')
          : ''
      };
    });
  }
);

export const getActiveWidget = createSelector(
  [getWidgets, getWidgetFromLocation, selectAnalysis],
  (widgets, activeWidgetKey, analysis) => {
    if (!widgets || analysis) return null;
    if (!activeWidgetKey) return widgets[0];
    return widgets.find(w => w.widget === activeWidgetKey);
  }
);

export const getNoDataMessage = createSelector(
  [getGeodescriberTitleFull, selectCategory],
  (title, category) => {
    if (!title || !category) return 'No data available';
    if (!category) return `No data available for ${title}`;
    return `No ${lowerCase(category)} data avilable for ${title}`;
  }
);

export const getWidgetsProps = () =>
  createStructuredSelector({
    loading: selectLoading,
    widgets: getWidgets,
    activeWidget: getActiveWidget,
    location: getLocation,
    emebd: selectEmbed,
    simple: selectSimple,
    modalClosing: selectModalClosing,
    noDataMessage: getNoDataMessage
  });
