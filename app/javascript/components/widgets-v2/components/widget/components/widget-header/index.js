import { connect } from 'react-redux';

import { setWidgetSettings } from 'components/widgets-v2/actions';
import { setShareModal } from 'components/modals/share/share-actions';
import { setModalMeta } from 'components/modals/meta/meta-actions';
import { setMapSettings } from 'components/map-v2/actions';
import { getWidgetHeaderProps } from './selectors';
import WidgetHeaderComponent from './component';

const actions = {
  setModalMeta,
  setShareModal,
  setMapSettings,
  setWidgetSettings
};

export default connect(getWidgetHeaderProps, actions)(WidgetHeaderComponent);
