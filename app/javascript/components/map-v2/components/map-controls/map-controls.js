import { connect } from 'react-redux';

import shareActions from 'components/modals/share/share-actions';
import mapActions from 'components/map-v2/actions';
import recentImageryActions from 'components/map-v2/components/recent-imagery/recent-imagery-actions';
import { setMenuSettings } from 'pages/map-v2/menu/menu-actions';
import Component from './map-controls-component';
import { getMapSettings } from '../../selectors';

const mapStateToProps = ({ location, recentImagery }) => ({
  settings: getMapSettings(location),
  recentImageryActive: recentImagery.active
});

const actions = { ...mapActions, ...shareActions, setMenuSettings, ...recentImageryActions };

export default connect(mapStateToProps, actions)(Component);
