import { connect } from 'react-redux';
import moment from 'moment';
import { isTouch } from 'utils/browser';
import { SCREEN_L } from 'utils/constants';

import shareActions from 'components/modals/share/share-actions';
import modalMetaActions from 'components/modals/meta/meta-actions';
import mapActions from 'components/map/map-actions';
import WidgetHeaderComponent from './widget-header-component';

const actions = {
  ...shareActions,
  ...modalMetaActions,
  ...mapActions
};

const mapStateToProps = (
  { location, modalMeta },
  { currentLabel, widget, title, config, indicatorWhitelist }
) => {
  const { payload, query } = location;
  const { country, region, subRegion, type } = payload;
  const category = query && query.category;
  const locationUrl = `${country || ''}${region ? `/${region}` : ''}${
    subRegion ? `/${subRegion}` : ''
  }`;
  const typePath = type || 'global';
  const widgetQuery = `widget=${widget}`;
  const widgetState = query[widget] ? `&${widget}=${query[widget]}` : '';
  const categoryQuery = category ? `category=${category}` : '';

  const shareUrl = `${window.location.origin}/dashboards/${typePath}/${
    locationUrl
  }?${widgetQuery}${widgetState ? `&${widgetState}` : ''} #${widget}`;
  const embedUrl = `${window.location.origin}/dashboards/${typePath}/embed/${
    widget
  }/${locationUrl}?${widgetQuery}${widgetState}`;

  const size = config.size;
  const isDeviceTouch = isTouch() || window.innerWidth < SCREEN_L;
  const widgetMetaKey =
    widget === 'treeCover' && indicatorWhitelist.plantations
      ? 'widget_natural_vs_planted'
      : config.metaKey;

  return {
    location,
    size,
    isDeviceTouch,
    widgetMetaKey,
    modalOpen: modalMeta.open,
    modalClosing: modalMeta.closing,
    citation: `Global Forest Watch. “${title} in ${
      currentLabel
    }”. Accessed on ${moment().format(
      'MMMM Do YYYY'
    )} from www.globalforestwatch.org.`,
    shareData: {
      title: 'Share this widget',
      subtitle: `${title} in ${currentLabel || ''}`,
      shareUrl,
      embedUrl,
      embedSettings:
        config.size === 'small'
          ? { width: 315, height: 460 }
          : { width: 670, height: 490 },
      socialText: `${title} in ${currentLabel || ''}`
    },
    title: currentLabel
      ? `${title} in ${currentLabel}`
      : `${location.payload.type} ${title}`
  };
};

export default connect(mapStateToProps, actions)(WidgetHeaderComponent);
