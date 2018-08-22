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
  { modalMeta },
  {
    currentLabel,
    widget,
    title,
    config,
    whitelist,
    shareUrl,
    embedUrl,
    location,
    query
  }
) => {
  const size = config.size;
  const isDeviceTouch = isTouch() || window.innerWidth < SCREEN_L;
  const widgetMetaKey =
    widget === 'treeCover' && whitelist && whitelist.indexOf('plantations') > -1
      ? 'widget_natural_vs_planted'
      : config.metaKey;
  let parsedTitle =
    title && currentLabel !== 'global'
      ? title.withLocation.replace('{location}', currentLabel)
      : title.global;
  if (
    title.withPlantations &&
    whitelist &&
    whitelist.indexOf('plantations') > -1
  ) { parsedTitle = title.withPlantations.replace('{location}', currentLabel); }

  return {
    location,
    query,
    size,
    isDeviceTouch,
    widgetMetaKey,
    modalOpen: modalMeta.open,
    modalClosing: modalMeta.closing,
    citation: `Global Forest Watch. “${
      parsedTitle
    }”. Accessed on ${moment().format(
      'MMMM Do YYYY'
    )} from www.globalforestwatch.org.`,
    shareData: {
      title: 'Share this widget',
      subtitle: parsedTitle,
      shareUrl,
      embedUrl,
      embedSettings:
        config.size === 'small'
          ? { width: 315, height: 460 }
          : { width: 670, height: 490 },
      socialText: parsedTitle
    },
    title: parsedTitle
  };
};

export default connect(mapStateToProps, actions)(WidgetHeaderComponent);
