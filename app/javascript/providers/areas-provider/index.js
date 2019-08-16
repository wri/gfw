import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getAreasProps } from './selectors';

class AreasProvider extends PureComponent {
  static propTypes = {
    areas: PropTypes.array,
    getAreas: PropTypes.func.isRequired,
    getArea: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool,
    loading: PropTypes.bool,
    location: PropTypes.object
  };

  componentDidMount() {
    const {
      getAreas,
      getArea,
      areas,
      loggedIn,
      location,
      loading
    } = this.props;
    if (!loading && isEmpty(areas) && loggedIn) {
      getAreas();
    }

    if (!loading && !loggedIn && location.type === 'aoi') {
      getArea(location.adm0);
    }
  }

  componentDidUpdate(prevProps) {
    const { loggedIn, loading, getAreas } = this.props;
    const { loggedIn: prevLoggedIn } = prevProps;

    if (!loading && loggedIn && loggedIn !== prevLoggedIn) {
      getAreas();
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

export default connect(getAreasProps, actions)(AreasProvider);
