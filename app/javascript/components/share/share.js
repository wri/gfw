import { connect } from 'react-redux';

import actions from './share-actions';
import reducers, { initialState } from './share-reducers';

import ShareComponent from './share-component';

const mapStateToProps = state => ({
  isOpen: state.share.isOpen,
  data: state.share.data
});

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(ShareComponent);
