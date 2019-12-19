import { createSelector, createStructuredSelector } from 'reselect';
import moment from 'moment';
import qs from 'query-string';
import { isTouch } from 'utils/browser';
import { SCREEN_L } from 'utils/constants';

export const selectModalOpen = state => state.modalMeta && state.modalMeta.open;
export const selectModalClosing = state =>
  state.modalMeta && state.modalMeta.closing;
export const selectLocation = state => state.location && state.location.payload;
export const selectSearch = state => state.location && state.location.search;
export const selectConfig = (state, { config }) => config;
export const selectTitle = (state, { config, title }) => title || config.title;
export const selectWidget = (state, { widget }) => widget;
export const selectLocationName = (state, { locationName }) => locationName;
export const selectWidgetMetaKey = (state, { config, widget, whitelists }) => {
  const whitelist = whitelists && whitelists[config.whitelistType || 'annual'];

  return widget === 'treeCover' &&
    whitelist &&
    whitelist.length &&
    whitelist.includes('plantations')
    ? 'widget_natural_vs_planted'
    : config.metaKey;
};

export const getParsedTitle = createSelector(
  [selectTitle, selectLocationName],
  (title, locationName) => {
    const titleString = typeof title === 'string' ? title : title.default;
    return titleString && titleString.replace('{location}', locationName || '');
  }
);

export const getShareData = createSelector(
  [getParsedTitle, selectConfig, selectSearch, selectLocation, selectWidget],
  (title, config, search, location, widget) => {
    const query = qs.parse(search);
    const { category } = query || {};
    const { type, adm0, adm1, adm2 } = location || {};
    const locationUrl = `dashboards/${type}/${adm0 || ''}${
      adm1 ? `/${adm1}` : ''
    }${adm2 ? `/${adm2}` : ''}`;
    const widgetQuery = `widget=${widget}`;
    const widgetState =
      query && query[widget] ? `&${widget}=${query[widget]}` : '';
    const categoryQuery = category ? `&category=${category}` : '';

    const shareUrl = `${window.location.origin}/${locationUrl}?${widgetQuery}${
      widgetState ? `${widgetState}` : ''
    }${categoryQuery}#${widget}`;
    const embedUrl = `${window.location.origin}/embed/${locationUrl}?${
      widgetQuery
    }${widgetState}`;
    return {
      title: 'Share this widget',
      subtitle: title,
      shareUrl,
      embedUrl,
      embedSettings:
        config.size === 'small'
          ? { width: 315, height: 460 }
          : { width: 670, height: 490 },
      socialText: title
    };
  }
);

export const getCitation = createSelector(
  [getParsedTitle],
  title =>
    (title
      ? `Global Forest Watch. “${title}”. Accessed on ${moment().format(
        'MMMM Do YYYY'
      )} from www.globalforestwatch.org.`
      : null)
);

export const getWidgetHeaderProps = createStructuredSelector({
  modalOpen: selectModalOpen,
  modalClosing: selectModalClosing,
  metakey: selectWidgetMetaKey,
  shareData: getShareData,
  title: getParsedTitle,
  citation: getCitation,
  isDeviceTouch: () => isTouch() || window.innerWidth < SCREEN_L
});
