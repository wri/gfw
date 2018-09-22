import { createSelector, createStructuredSelector } from 'reselect';
import moment from 'moment';
import { isTouch } from 'utils/browser';
import { SCREEN_L } from 'utils/constants';

export const selectModalOpen = state => state.modalMeta.open;
export const selectModalClosing = state => state.modalMeta.closing;
export const selectLocation = state => state.location && state.location.payload;
export const selectQuery = state => state.location && state.location.query;
export const selectConfig = (state, { config }) => config;
export const selectWidget = (state, { widget }) => widget;
export const selectLocationName = (state, { locationName }) => locationName;
export const selectWidgetMetaKey = (state, { config, id, activeWhitelist }) =>
  (id === 'treeCover' &&
  activeWhitelist &&
  activeWhitelist.contains('plantations')
    ? 'widget_natural_vs_planted'
    : config.metaKey);

export const getParsedTitle = createSelector(
  [selectConfig, selectLocationName],
  (config, locationName) =>
    config.title.replace('{location}', locationName || '')
);

export const getShareData = createSelector(
  [getParsedTitle, selectConfig, selectQuery, selectLocation, selectWidget],
  (title, config, query, location, widget) => {
    const { category } = query || {};
    const { type, country, region, subRegion } = location;
    const locationUrl = `dashboards/${type}/${country || ''}${
      region ? `/${region}` : ''
    }${subRegion ? `/${subRegion}` : ''}`;
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
