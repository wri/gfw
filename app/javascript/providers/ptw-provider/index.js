import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = ({ location, ptw }) => ({
  location: location.payload,
  data: ptw.data
});

class PlacesToWatchProvider extends PureComponent {
  componentDidMount() {
    const { date, getPTW, data } = this.props;
    if (date && isEmpty(data)) {
      getPTW(date);
    }
  }

  render() {
    return null;
  }
}

PlacesToWatchProvider.propTypes = {
  date: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  getPTW: PropTypes.func.isRequired
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(PlacesToWatchProvider);
