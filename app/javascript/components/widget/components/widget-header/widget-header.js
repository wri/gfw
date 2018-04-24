import { connect } from 'react-redux';
import moment from 'moment';

import shareActions from 'components/modals/share/share-actions';
import modalMetaActions from 'component/modals/meta/modal-meta-actions';
import mapActions from 'components/map/map-actions';
import WidgetHeaderComponent from './widget-header-component';

const actions = {
  ...shareActions,
  ...modalMetaActions,
  ...mapActions
};

const mapStateToProps = ({ location, modalMeta }, ownProps) => {
  const { locationNames, widget, title, settingsConfig } = ownProps;
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

  return {
    location,
    modalOpen: modalMeta.open,
    modalClosing: modalMeta.closing,
    citation: `Global Forest Watch. “${title} in ${locationNames &&
      locationNames.current &&
      locationNames.current.label}”. Accessed on ${moment().format(
      'MMMM Do YYYY'
    )} from www.globalforestwatch.org.`,
    shareData: {
      title: 'Share this widget',
      subtitle: `${title} in ${
        locationNames.current ? locationNames.current.label : ''
      }`,
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
        settingsConfig.config.size === 'small'
          ? { width: 315, height: 460 }
          : { width: 670, height: 490 },
      socialText: `${title} in ${
        locationNames.current ? locationNames.current.label : ''
      }`
    }
  };
};

export default connect(mapStateToProps, actions)(WidgetHeaderComponent);
