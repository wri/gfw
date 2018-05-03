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
  { currentLocation, widget, title, config, whitelist }
) => {
  const locationUrl = `${location.payload.country}${
    location.payload.region ? `/${location.payload.region}` : ''
  }${location.payload.subRegion ? `/${location.payload.subRegion}` : ''}`;

  const embedUrl = `${window.location.origin}/country/embed/${widget}/${
    locationUrl
  }${
    location.query && location.query[widget]
      ? `?${widget}=${location.query[widget]}`
      : ''
  }`;
  const size = config.size;
  const isDeviceTouch = isTouch() || window.innerWidth < SCREEN_L;
  const widgetMetaKey =
    widget === 'treeCover' && whitelist.plantations
      ? 'widget_natural_vs_planted'
      : config.metaKey;

  return {
    location,
    size,
    isDeviceTouch,
    widgetMetaKey,
    modalOpen: modalMeta.open,
    modalClosing: modalMeta.closing,
    citation: `Global Forest Watch. “${title} in ${currentLocation &&
      currentLocation.label}”. Accessed on ${moment().format(
      'MMMM Do YYYY'
    )} from www.globalforestwatch.org.`,
    shareData: {
      title: 'Share this widget',
      subtitle: `${title} in ${currentLocation ? currentLocation.label : ''}`,
      shareUrl: `http://${window.location.host}/country/${locationUrl}?${
        location.query && location.query.category
          ? `category=${location.query.category}&`
          : ''
      }widget=${widget}${
        location.query && location.query[widget]
          ? `&${widget}=${location.query[widget]}`
          : ''
      }#${widget}`,
      embedUrl,
      embedSettings:
        config.size === 'small'
          ? { width: 315, height: 460 }
          : { width: 670, height: 490 },
      socialText: `${title} in ${currentLocation ? currentLocation.label : ''}`
    }
  };
};

export default connect(mapStateToProps, actions)(WidgetHeaderComponent);
