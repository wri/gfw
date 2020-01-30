import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import reducerRegistry from 'app/registry';
import { CancelToken } from 'axios';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getAreasProps } from './selectors';

class AreasProvider extends PureComponent {
  static propTypes = {
    areas: PropTypes.array,
    getAreasProvider: PropTypes.func.isRequired,
    getAreaProvider: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool,
    loading: PropTypes.bool,
    location: PropTypes.object
  };

  componentDidMount() {
    const { getAreaProvider, areas, loggedIn, location, loading } = this.props;
    if (!loading && isEmpty(areas) && loggedIn) {
      this.handleGetAreas();
    }

    if (!loading && !loggedIn && isEmpty(areas) && location.type === 'aoi') {
      getAreaProvider(location.adm0);
    }
  }

  componentDidUpdate(prevProps) {
    const { loggedIn, loading } = this.props;
    const { loggedIn: prevLoggedIn } = prevProps;

    if (!loading && loggedIn && loggedIn !== prevLoggedIn) {
      this.handleGetAreas();
    }
  }

  handleGetAreas = () => {
    const { getAreasProvider } = this.props;
    this.cancelAreasFetch();
    this.areasFetch = CancelToken.source();

    getAreasProvider(this.areasFetch.token);
  };

  cancelAreasFetch = () => {
    if (this.areasFetch) {
      this.areasFetch.cancel('Cancelling areas fetches');
    }
  };

  render() {
    return null;
  }
}

reducerRegistry.registerModule('areas', {
  actions,
  reducers,
  initialState
});

export default connect(getAreasProps, actions)(AreasProvider);
