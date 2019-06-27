import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = ({ areas }) => ({
  data: areas && areas.data
});

class AreasProvider extends PureComponent {
  componentDidMount() {
    const { getAreas, data } = this.props;
    if (isEmpty(data)) {
      getAreas();
    }
  }

  render() {
    return null;
  }
}

AreasProvider.propTypes = {
  data: PropTypes.array,
  getAreas: PropTypes.func.isRequired
};

reducerRegistry.registerModule('areas', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, actions)(AreasProvider);
