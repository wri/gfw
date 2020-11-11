import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import reducerRegistry from 'redux/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getAreasProps } from './selectors';

class AreasProvider extends PureComponent {
  static propTypes = {
    getAreasProvider: PropTypes.func.isRequired,
    getAreaProvider: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool,
    loggingIn: PropTypes.bool,
    loading: PropTypes.bool,
    location: PropTypes.object,
    areas: PropTypes.array,
  };

  componentDidMount() {
    const { loggedIn, location, loading } = this.props;
    if (!loading && loggedIn) {
      this.handleGetAreas();
    }

    if (!loading && location?.type === 'aoi' && !loggedIn) {
      this.handleGetAreas(location.adm0);
    }
  }

  componentDidUpdate(prevProps) {
    const { loggedIn, loggingIn, loading, location, areas } = this.props;
    const { loggedIn: prevLoggedIn } = prevProps;

    if (!loading && loggedIn && loggedIn !== prevLoggedIn) {
      this.handleGetAreas();
    }

    if (
      !loading &&
      !loggedIn &&
      !loggingIn &&
      location?.type === 'aoi' &&
      !areas?.length
    ) {
      this.handleGetAreas(location.adm0);
    }
  }

  handleGetAreas = (id) => {
    const { getAreasProvider, getAreaProvider } = this.props;

    if (id) {
      getAreaProvider(id);
    } else {
      getAreasProvider();
    }
  };

  render() {
    return null;
  }
}

reducerRegistry.registerModule('areas', {
  actions,
  reducers,
  initialState,
});

export default connect(getAreasProps, actions)(AreasProvider);
