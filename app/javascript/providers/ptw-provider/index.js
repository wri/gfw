import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = ({ location }) => ({
  location: location.payload
});

class PlacesToWatchProvider extends PureComponent {
  componentDidMount() {
    const { date, getPTW } = this.props;

    if (date) {
      getPTW(date);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { date, getPTW } = nextProps;
    if (date !== this.props.date) {
      getPTW(date);
    }
  }

  render() {
    return null;
  }
}

PlacesToWatchProvider.propTypes = {
  date: PropTypes.object.isRequired,
  getPTW: PropTypes.func.isRequired
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(PlacesToWatchProvider);
