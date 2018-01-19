import { connect } from 'react-redux';
import compact from 'lodash/compact';

import shareActions from 'components/share/share-actions';
import modalMetaActions from 'components/modal-meta/modal-meta-actions';
import WidgetHeaderComponent from './widget-header-component';

const actions = { ...shareActions, ...modalMetaActions };

const mapStateToProps = ({ location, modalMeta }, ownProps) => {
  const { locationNames, widget, title, settingsConfig } = ownProps;
  const locationUrl = compact(
    Object.keys(location.payload).map(key => location.payload[key])
  ).join('/');
  const embedUrl = `${
    window.location.origin
  }/country/embed/${widget}/${locationUrl}${
    location.query && location.query[widget]
      ? `?${widget}=${location.query[widget]}`
      : ''
  }`;

  return {
    location,
    modalOpen: modalMeta.open,
    modalClosing: modalMeta.closing,
    shareData: {
      title: 'Share this widget',
      subtitle: `${title} in ${
        locationNames.current ? locationNames.current.label : ''
      }`,
      shareUrl: `${window.location.href}#${widget}`,
      embedUrl,
      embedSettings:
        settingsConfig.config.size === 'small'
          ? { width: 315, height: 460 }
          : { width: 670, height: 490 }
    }
  };
};

export default connect(mapStateToProps, actions)(WidgetHeaderComponent);
