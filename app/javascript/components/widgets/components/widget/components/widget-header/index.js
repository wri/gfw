import { connect } from 'react-redux';

import { setWidgetSettings, setActiveWidget } from 'components/widgets/actions';
import { setShareModal } from 'components/modals/share/share-actions';
import { setModalMetaSettings } from 'components/modals/meta/actions';
import { setMapSettings } from 'components/map/actions';
import { getWidgetHeaderProps } from './selectors';
import WidgetHeaderComponent from './component';

const actions = {
  setModalMetaSettings,
  setShareModal,
  setMapSettings,
  setWidgetSettings,
  setActiveWidget
};

export default connect(getWidgetHeaderProps, actions)(WidgetHeaderComponent);
