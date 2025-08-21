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
import { translateText, selectActiveLang } from 'utils/lang';

import { getAllAreas } from 'providers/areas-provider/selectors';
import { getGFWMeta } from 'providers/meta-provider/selectors';
import { getGeodescriberTitleFull } from 'providers/geodescriber-provider/selectors';
import { getActiveLayersWithDates } from 'components/map/selectors';
import { getDataLocation, locationLevelToStr } from 'utils/location';

import CATEGORIES from 'data/categories.json';
import tropicalIsos from 'data/tropical-isos.json';
import colors from 'data/colors.json';

import {
  getSettingsConfig,
  getOptionsSelected,
  getIndicator,
  getStatements,
  getLocationPath,
} from './utils/config';
import allWidgets from './manifest';

const isServer = typeof window === 'undefined';
const ENVIRONMENT = process.env.NEXT_PUBLIC_FEATURE_ENV;

const buildLocationDict = (locations) =>
  (locations &&
    !!locations.length &&
    locations.reduce(
      (dict, next) => ({
        ...dict,
        [next.value || next.id]: {
          ...next,
        },
      }),
      {}
    )) ||
  {};

const handleWidgetProxy = (widgets, settings) => {
  return Object.values(widgets).map((raw) => {
    if (raw?.proxy) {
      const currentSettings = settings[raw.widget];
      const useWidget = raw.getWidget(currentSettings);
      return {
        ...raw,
        ...useWidget,
        widget: raw.widget,
        proxying: useWidget.widget,
        proxyOn: raw.refetchKeys,
        refetchKeys: [...raw.refetchKeys, ...useWidget.refetchKeys],
      };
    }
    return raw;
  });
};

const isAuthenticated = (state) => state?.myGfw?.data?.loggedIn || false;

export const selectGroupBySubcategory = (state, { groupBySubcategory }) =>
  groupBySubcategory;
export const selectLocation = (state) =>
  state.location && state.location.payload;
export const getCategory = (state) => state?.widgets?.category;
export const selectIsTrase = (state) => state.location?.query?.trase;
export const selectRouteType = (state) =>
  state.location && state.location.pathname;
export const selectActiveWidget = (state) => state.widgets?.activeWidget;
export const selectLocationQuery = (state) =>
  state.location && state.location.query;
export const selectWidgetSettings = (state) => state.widgets?.settings || {};
export const selectWidgetInteractions = (state) =>
  state.widgets?.interactions || {};
export const selectLocationSearch = (state) =>
  state.location && state.location.search;
export const selectWidgetsData = (state) => state.widgets && state.widgets.data;
export const selectWidgetsChartSettings = (state) =>
  state.widgets && state.widgets.chartSettings;
export const selectGeostore = (state) => state.geostore && state.geostore.data;
export const selectLoadingFilterData = (state) =>
  state.countryData &&
  state.whitelists &&
  state.areas &&
  (state.countryData.countriesLoading ||
    state.countryData.regionsLoading ||
    state.countryData.subRegionsLoading ||
    state.areas.loading ||
    state.whitelists.loading);
export const selectLoadingMeta = (state) =>
  state.geostore &&
  state.geodescriber &&
  state.meta &&
  (state.geostore.loading || state.geodescriber.loading || state.meta.loading);
export const selectCountryData = (state) => state.countryData;
export const selectPolynameWhitelist = (state) =>
  state.whitelists && state.whitelists.data;
export const selectEmbed = (state, { embed }) => embed;
export const selectSimple = (state, { simple }) => simple;
export const selectAnalysis = (state, { analysis }) => analysis;
export const selectCategory = (state) => state?.widgets?.category;
export const selectModalClosing = (state) =>
  state.modalMeta && state.modalMeta.closing;
export const selectNonGlobalDatasets = (state) =>
  state.widgets && state.widgets.data.nonGlobalDatasets;

const applySettingsConfigGlobalRules = (config, params) => {
  if (!config) return config;

  const isCAR = params.adm0 === 'CAF';

  return config.map((field) => {
    if (field.key === 'landCategory' && isCAR) {
      return {
        ...field,
        blacklist: ['mining'],
      };
    }
    return field;
  });
};

export const getLocationObj = createSelector(
  [getDataLocation, getGeodescriberTitleFull],
  (location, title) => ({
    ...location,
    locationLabel: location.type === 'global' ? 'global' : title,
    adminLevel: locationLevelToStr(location),
    locationLabelFull: location.type === 'global' ? 'global' : title,
    isTropical: location && tropicalIsos.includes(location.adm0),
  })
);

export const getAllLocationData = createSelector(
  [
    getDataLocation,
    selectCountryData,
    getAllAreas,
    selectRouteType,
    selectLocationQuery,
  ],
  (dataLocation, countryData, areas, routeType, query) => {
    if (isEmpty(areas) && isEmpty(countryData)) return null;
    const { type, adm0, adm1, areaId } = dataLocation;

    if (areaId && type !== 'country') {
      return { adm0: areas.map((a) => ({ ...a, value: a.geostore })) };
    }

    if (type === 'global' || type === 'country') {
      return {
        adm0: countryData.countries.map((l) => ({
          ...l,
          path: getLocationPath(routeType, type, query, { adm0: l.value }),
        })),
        adm1: countryData.regions.map((l) => ({
          ...l,
          path: getLocationPath(routeType, type, query, {
            adm0,
            adm1: l.value,
          }),
        })),
        adm2: countryData.subRegions.map((l) => ({
          ...l,
          path: getLocationPath(routeType, type, query, {
            adm0,
            adm1,
            adm2: l.value,
          }),
        })),
        fao: countryData.faoCountries,
      };
    }

    return {};
  }
);

export const getLocationData = createSelector(
  [getLocationObj, getAllLocationData, selectPolynameWhitelist],
  (locationObj, allLocationData, polynamesWhitelist) => {
    const { type, adminLevel, locationLabel, adm0, adm1, areaId } = locationObj;
    const {
      adm0: adm0Data,
      adm1: adm1Data,
      adm2: adm2Data,
    } = allLocationData || {};

    let parent = {};
    let parentData = adm0Data;
    let children = adm0Data;
    if (adminLevel === 'adm0') {
      parent = { label: 'global', value: 'global' };
      children = adm1Data;
    } else if (adminLevel === 'adm1') {
      parent = adm0Data && adm0Data.find((d) => d.value === adm0);
      parentData = adm0Data;
      children = adm2Data;
    } else if (adminLevel === 'adm2') {
      parent = adm1Data && adm1Data.find((d) => d.value === adm1);
      parentData = adm1Data;
      children = [];
    }

    const locationData = allLocationData?.[adminLevel] || adm0Data;
    const currentLocation =
      locationData &&
      locationObj &&
      locationData.find(
        (d) =>
          d.value === locationObj[adminLevel] ||
          (d.id && d.id === locationObj.areaId)
      );

    const status = ['global', 'country', 'wdpa'].includes(locationObj.type)
      ? 'saved'
      : (currentLocation && currentLocation.status) || 'unsaved';

    return {
      parent,
      parentLabel: parent && parent.label,
      parentData: parentData && buildLocationDict(parentData),
      location: currentLocation || { label: 'global', value: 'global' },
      locationData: locationData && buildLocationDict(locationData),
      locationLabel:
        ['global', 'geostore', 'wdpa', 'use'].includes(type) || areaId
          ? locationLabel
          : currentLocation && currentLocation.label,
      childData: children && buildLocationDict(children),
      polynamesWhitelist,
      status,
    };
  }
);

export const filterWidgetsByLocation = createSelector(
  [
    getLocationObj,
    getLocationData,
    selectPolynameWhitelist,
    selectEmbed,
    selectActiveWidget,
    getActiveLayersWithDates,
    selectAnalysis,
    selectWidgetSettings,
  ],
  (
    location,
    locationData,
    polynameWhitelist,
    embed,
    widget,
    layers,
    showAnalysis,
    settings
  ) => {
    const { adminLevel, type, areaId } = location;
    const handleProxyWidget = handleWidgetProxy(allWidgets, settings);
    const widgets = handleProxyWidget.map((w) => ({
      ...w,
      ...(w.colors && {
        colors: colors[w.colors],
      }),
    }));

    if (embed && widget) return widgets.filter((w) => w.widget === widget);
    const layerIds = layers && layers.map((l) => l.id);

    return widgets.filter((w) => {
      const {
        types,
        admins,
        whitelists: allowedList,
        blacklists: deniedList,
        source,
        datasets,
        visible,
      } = w || {};
      const { fao, status } = locationData || {};

      const layerIntersection =
        datasets &&
        intersection(
          compact(
            flatMap(
              datasets
                .filter((d) => !d.boundary)
                .map((d) => {
                  const layersArray = Array.isArray(d.layers) && d.layers;

                  return layersArray;
                })
            )
          ),
          layerIds
        );

      const hasLocation =
        types &&
        types.includes(areaId && status === 'saved' ? 'aoi' : type) &&
        admins &&
        admins.includes(adminLevel);

      const adminAllowedList =
        type === 'country' && allowedList && allowedList.adm0;

      const matchesAllowedList =
        !adminAllowedList || adminAllowedList.includes(location.adm0);

      const adminDeniedList =
        type === 'country' && deniedList && deniedList.adm0;

      const notInDeniedList =
        !adminDeniedList || !adminDeniedList?.includes(location.adm0);

      const isFAOCountry =
        source !== 'fao' || (fao && fao.find((f) => f.value === location.adm0));

      const polynameIntersection =
        allowedList &&
        allowedList.indicators &&
        intersection(
          polynameWhitelist?.[
            w.whitelistType || w?.settings?.dataset || 'annual'
          ],
          allowedList.indicators
        );
      const matchesPolynameWhitelist =
        type === 'global' ||
        !allowedList ||
        !allowedList.indicators ||
        (polynameIntersection && polynameIntersection.length);
      const isWidgetDataPending =
        // for geostore shapes sometimes the data is not ready (no cached tables)
        !allowedList ||
        (status && status !== 'pending') ||
        !allowedList.checkStatus;

      const isWidgetVisible =
        (!showAnalysis && !visible) ||
        (showAnalysis &&
          visible &&
          visible.includes('analysis') &&
          !isEmpty(layerIntersection)) ||
        (!showAnalysis && visible && visible.includes('dashboard'));

      let published = true;

      if (ENVIRONMENT === 'production' && w?.published === false) {
        published = false;
      }

      return (
        hasLocation &&
        matchesAllowedList &&
        matchesPolynameWhitelist &&
        isFAOCountry &&
        isWidgetVisible &&
        notInDeniedList &&
        isWidgetDataPending &&
        published
      );
    });
  }
);

export const getWidgetCategories = createSelector(
  [filterWidgetsByLocation],
  (widgets) =>
    flatMap(
      widgets.map((w) => {
        return w.categories;
      })
    )
);

export const filterWidgetsByCategory = createSelector(
  [
    filterWidgetsByLocation,
    selectCategory,
    selectAnalysis,
    selectEmbed,
    selectActiveWidget,
  ],
  (widgets, category, showAnalysis, embed, widget) => {
    if (isEmpty(widgets)) return null;

    if (embed && widget)
      return widgets.filter((w) => {
        return w.widget === widget;
      });

    if (showAnalysis) {
      return sortBy(widgets, 'sortOrder.summary');
    }

    return sortBy(
      widgets.filter((w) => {
        return w.categories.includes(category);
      }),
      `sortOrder[${camelCase(category)}]`
    );
  }
);

export const getWidgets = createSelector(
  [
    filterWidgetsByCategory,
    getLocationObj,
    getLocationData,
    selectWidgetsData,
    selectWidgetsChartSettings,
    selectWidgetSettings,
    selectWidgetInteractions,
    selectLocationSearch,
    selectNonGlobalDatasets,
    selectIsTrase,
    getActiveLayersWithDates,
    selectAnalysis,
    selectActiveWidget,
    selectActiveLang,
  ],
  (
    widgets,
    locationObj,
    locationData,
    widgetsData,
    widgetsChartSettings,
    widgetSettings,
    interactions,
    search,
    datasets,
    isTrase,
    layers,
    analysis,
    activeWidgetKey,
    lang
  ) => {
    if (isEmpty(widgets) || !locationObj || !widgetsData) {
      return null;
    }

    const { locationLabelFull, type, adm0, adm1, adm2 } = locationObj || {};
    const { polynamesWhitelist, status } = locationData || {};
    return widgets.map((w, index) => {
      const {
        settings: defaultSettings,
        widget,
        pendingKeys,
        title: titleTemplate,
        dataType: dataTypeStr,
        getDataType: dataTypeFn,
        settingsConfig: settingsConfigArr,
        getSettingsConfig: settingsConfigFn,
        noStatements,
      } = w || {};
      const active =
        (!activeWidgetKey && index === 0) || activeWidgetKey === widget;

      const rawData = widgetsData && widgetsData[widget];
      const chartSettings =
        widgetsChartSettings && widgetsChartSettings[widget];

      const { settings: dataSettings } = rawData || {};

      const widgetLayer =
        layers &&
        layers.find(
          (l) =>
            w.datasets &&
            flatMap(w.datasets.map((d) => d.layers)).includes(l.id)
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

      const widgetQuerySettings = widgetSettings && widgetSettings[widget];
      const widgetInteraction = interactions && interactions[widget];

      const layerSettings = {
        ...layerParams,
        ...decodeParams,
        ...(startYear && {
          startYear,
        }),
        ...(endYear && {
          endYear,
        }),
      };

      const mergedSettings = {
        ...defaultSettings,
        ...dataSettings,
        ...widgetQuerySettings,
        ...(analysis && {
          ...layerSettings,
        }),
      };

      const settings = {
        ...mergedSettings,
        ...(mergedSettings.ifl === 2016 && {
          extentYear: 2010,
        }),
        ...(mergedSettings.forestType === 'primary_forest' && {
          extentYear: 2000,
        }),
      };

      const dataType = dataTypeStr || (dataTypeFn && dataTypeFn(settings));

      const dataOptions = rawData && rawData.options;

      let settingsConfig =
        settingsConfigArr ||
        (settingsConfigFn &&
          settingsConfigFn({
            ...locationObj,
            ...settings,
          }));

      settingsConfig = applySettingsConfigGlobalRules(settingsConfig, {
        ...locationObj,
        ...settings,
      });

      const settingsConfigParsed = getSettingsConfig({
        settingsConfig,
        dataOptions,
        settings,
        polynamesWhitelist:
          polynamesWhitelist &&
          polynamesWhitelist[w.whitelistType || settings.dataset || 'annual'],
        status,
        pendingKeys,
      });

      const optionsSelected =
        settingsConfigParsed && getOptionsSelected(settingsConfigParsed);

      const forestType = optionsSelected && optionsSelected.forestType;
      const landCategory = optionsSelected && optionsSelected.landCategory;
      const indicator = getIndicator(forestType, landCategory);

      const { ifl } = settings || {};

      const settingsConfigFiltered =
        settingsConfigParsed &&
        settingsConfigParsed.filter(
          (o) =>
            o.key !== 'extentYear' ||
            (ifl !== 2016 &&
              settings.forestType !== 'primary_forest' &&
              settings.forestType !== 'ifl')
        );

      const settingConfigFilteredKeys =
        settingsConfigFiltered?.map((scf) => scf.key) || [];

      const allowedFooterSettings = Object.keys(settings)
        .filter((key) => settingConfigFilteredKeys.includes(key))
        .reduce((obj, key) => {
          obj[key] = settings[key];
          return obj;
        }, {});

      const footerStatements = getStatements({
        forestType,
        landCategory,
        datasets,
        type,
        dataType,
        active,
        noStatements,
        settings: {
          ...defaultSettings,
          ...allowedFooterSettings,
        },
      });

      const props = {
        ...w,
        ...locationObj,
        ...locationData,
        locationType: locationObj?.locationType,
        active,
        data: rawData,
        chartSettings,
        settings,
        interaction: widgetInteraction,
        title: titleTemplate,
        settingsConfig: settingsConfigFiltered,
        optionsSelected,
        indicator,
        showAttributionLink: isTrase,
        statements: footerStatements,
        lang,
      };

      const parsedProps = props.getWidgetProps && props.getWidgetProps(props);
      const { title: parsedTitle } = parsedProps || {};
      const title = parsedTitle || titleTemplate;

      const downloadLink =
        props.getDownloadLink &&
        props.getDownloadLink({ ...props, ...parsedProps });

      const searchObject = qs.parse(search);
      const widgetQuery = searchObject && searchObject[widget];
      const shareUrl =
        !isServer &&
        `${window.location.origin}${window.location.pathname}?${
          searchObject
            ? qs.stringify({
                ...searchObject,
                widget,
                showMap: false,
                scrollTo: widget,
              })
            : ''
        }`;
      const embedUrl =
        !isServer &&
        `${window.location.origin}/embed/widget/${widget}/${type}${
          adm0 ? `/${adm0}` : ''
        }${adm1 ? `/${adm1}` : ''}${adm2 ? `/${adm2}` : ''}${
          widgetQuery ? `?${widget}=${widgetQuery}` : ''
        }`;

      return {
        ...props,
        ...parsedProps,
        shareUrl,
        embedUrl,
        downloadLink,
        rawData,
        title: title
          ? translateText(title)?.replace(
              '{location}',
              locationLabelFull || 'selected area'
            )
          : '',
      };
    });
  }
);

export const getWidgetsGroupedBySubcategory = createSelector(
  [getCategory, getWidgets],
  (category, widgets) => {
    const subcategories = CATEGORIES.find(
      ({ value }) => value === category
    )?.subcategories;

    if (!widgets || !subcategories) return [];

    const groupedWidgets = [];

    groupedWidgets.push({
      id: null,
      label: null,
      widgets: widgets.filter((widget) => !widget.subcategories),
    });

    subcategories.forEach(({ label, value }) => {
      groupedWidgets.push({
        id: value,
        label,
        widgets: widgets.filter((widget) =>
          widget.subcategories?.includes(value)
        ),
      });
    });

    return groupedWidgets.filter((gw) => gw.widgets.length);
  }
);

export const getActiveWidget = createSelector(
  [
    getWidgets,
    getWidgetsGroupedBySubcategory,
    selectActiveWidget,
    selectAnalysis,
    selectGroupBySubcategory,
  ],
  (widgets, widgetGroups, activeWidgetKey, analysis, groupBySubcategory) => {
    if (!widgets || analysis) return null;

    if (!activeWidgetKey) {
      return groupBySubcategory ? widgetGroups[0]?.widgets[0] : widgets[0];
    }

    return widgets.find((w) => w.widget === activeWidgetKey);
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
    loadingData: selectLoadingFilterData,
    loadingMeta: selectLoadingMeta,
    authenticated: isAuthenticated,
    widgets: getWidgets,
    widgetsGroupedBySubcategory: getWidgetsGroupedBySubcategory,
    activeWidget: getActiveWidget,
    location: getDataLocation,
    emebd: selectEmbed,
    category: getCategory,
    simple: selectSimple,
    modalClosing: selectModalClosing,
    noDataMessage: getNoDataMessage,
    geostore: selectGeostore,
    meta: getGFWMeta,
  });
