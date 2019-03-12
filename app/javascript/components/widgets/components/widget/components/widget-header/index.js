import { connect } from 'react-redux';

import { setWidgetSettings, setActiveWidget } from 'components/widgets/actions';
import { setShareModal } from 'components/modals/share/share-actions';
import { setModalMetaSettings } from 'components/modals/meta/meta-actions';
import { setMapSettings } from 'components/maps/map/actions';
import { setDashboardsSettings } from 'pages/dashboards/actions';
import { getWidgetHeaderProps } from './selectors';
import WidgetHeaderComponent from './component';

const actions = {
  setModalMetaSettings,
  setShareModal,
  setMapSettings,
  setWidgetSettings,
  setActiveWidget,
  setDashboardsSettings
};

export default connect(getWidgetHeaderProps, actions)(WidgetHeaderComponent);
