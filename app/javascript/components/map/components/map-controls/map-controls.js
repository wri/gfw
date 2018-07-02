import { connect } from 'react-redux';

import shareActions from 'components/modals/share/share-actions';
import mapActions from 'components/map/map-actions';
import Component from './map-controls-component';

const mapStateToProps = ({ map }) => ({
  ...map
});

const actions = { ...mapActions, ...shareActions };

export default connect(mapStateToProps, actions)(Component);
