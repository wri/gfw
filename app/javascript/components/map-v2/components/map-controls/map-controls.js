import { connect } from 'react-redux';

import shareActions from 'components/modals/share/share-actions';
import mapActions from 'components/map-v2/actions';
import Component from './map-controls-component';
import { getMapSettings } from '../../selectors';

const mapStateToProps = ({ location }) => ({
  settings: getMapSettings(location)
});

const actions = { ...mapActions, ...shareActions };

export default connect(mapStateToProps, actions)(Component);
