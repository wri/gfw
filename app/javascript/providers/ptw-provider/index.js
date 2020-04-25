import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = ({ location, ptw }) => ({
  location,
  data: ptw?.data
});

class PlacesToWatchProvider extends PureComponent {
  componentDidMount() {
    const { getPTW, data } = this.props;
    if (isEmpty(data)) {
      getPTW();
    }
  }

  render() {
    return null;
  }
}

PlacesToWatchProvider.propTypes = {
  data: PropTypes.array.isRequired,
  getPTW: PropTypes.func.isRequired
};

reducerRegistry.registerModule('ptw', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, actions)(PlacesToWatchProvider);
