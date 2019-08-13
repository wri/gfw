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
    const {
      location,
      loading,
      geojson,
      getGeodescriber,
      getAdminGeodescriber
    } = this.props;

    if (geojson && !loading && location.type !== 'country') {
      getGeodescriber(geojson);
    }

    if (geojson && !loading && location.type === 'country') {
      getAdminGeodescriber(geojson);
    }
  }

  componentDidUpdate(prevProps) {
    const { loading, geojson } = this.props;
    const { geojson: prevGeojosn } = prevProps;

    if (!loading && geojson && !isEqual(geojson, prevGeojosn)) {
      this.handleGetGeodescriber(geojson);
    }
  }

  handleGetGeodescriber = geojson => {
    const {
      location: { type },
      getGeodescriber,
      getAdminGeodescriber
    } = this.props;
    this.cancelGeodescriberFetch();
    this.geodescriberFetch = CancelToken.source();

    if (type === 'country') {
      getAdminGeodescriber({
        ...location,
        token: this.geodescriberFetch.token
      });
    } else {
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
