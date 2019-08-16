import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CancelToken } from 'axios';
import isEqual from 'lodash/isEqual';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getGeodescriberProps } from './selectors';

class GeodescriberProvider extends PureComponent {
  static propTypes = {
    getGeodescriber: PropTypes.func,
    getAdminGeodescriber: PropTypes.func,
    geojson: PropTypes.object,
    location: PropTypes.object,
    loading: PropTypes.bool
  };

  componentDidMount() {
    const { location, loading, geojson } = this.props;

    if (
      !loading &&
      ((location.type !== 'country' && geojson) ||
        ['global', 'country'].includes(location.type))
    ) {
      this.handleGetGeodescriber();
    }
  }

  componentDidUpdate(prevProps) {
    const { loading, geojson, location } = this.props;
    const { geojson: prevGeojosn, location: prevLocation } = prevProps;

    if (
      !loading &&
      ((geojson && !isEqual(geojson, prevGeojosn)) ||
        (['global', 'country'].includes(location.type) &&
          !isEqual(location, prevLocation)))
    ) {
      this.handleGetGeodescriber();
    }
  }

  handleGetGeodescriber = () => {
    const {
      location: { type },
      geojson,
      getGeodescriber,
      getAdminGeodescriber
    } = this.props;
    this.cancelGeodescriberFetch();
    this.geodescriberFetch = CancelToken.source();

    if (type === 'country' || type === 'global') {
      getAdminGeodescriber({
        ...location,
        token: this.geodescriberFetch.token
      });
    } else if (geojson) {
      getGeodescriber({ geojson, token: this.geodescriberFetch.token });
    }
  };

  cancelGeodescriberFetch = () => {
    if (this.geodescriberFetch) {
      this.geodescriberFetch.cancel();
    }
  };

  render() {
    return null;
  }
}

reducerRegistry.registerModule('geodescriber', {
  actions,
  reducers,
  initialState
});

export default connect(getGeodescriberProps, actions)(GeodescriberProvider);
