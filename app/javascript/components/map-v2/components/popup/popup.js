import { connect } from 'react-redux';

import Component from './component';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getPopupProps } from './selectors';

import './styles.scss';

const mapStateToProps = ({ popup, location, datasets }) => ({
  ...getPopupProps({
    ...popup,
    query: location.query,
    datasets: datasets.datasets
  })
});

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(Component);
