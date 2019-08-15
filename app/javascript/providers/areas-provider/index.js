import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = ({ areas, myGfw, location }) => ({
  data: areas && areas.data,
  loading: areas && areas.loading,
  loggedIn: !!myGfw && !isEmpty(myGfw.data),
  location: location && location.payload
});

class AreasProvider extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    getAreas: PropTypes.func.isRequired,
    getArea: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool,
    loading: PropTypes.bool,
    location: PropTypes.object
  };

  componentDidMount() {
    const { getAreas, getArea, data, loggedIn, location, loading } = this.props;
    if (!loading && isEmpty(data) && loggedIn) {
      getAreas();
    }

    if (!loading && !loggedIn && location.type === 'aoi') {
      getArea(location.adm0);
    }
  }

  render() {
    return null;
  }
}

reducerRegistry.registerModule('areas', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, actions)(AreasProvider);
