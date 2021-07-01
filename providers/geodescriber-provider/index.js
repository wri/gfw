import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CancelToken } from 'axios';
import isEqual from 'lodash/isEqual';
import reducerRegistry from 'redux/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getGeodescriberProps } from './selectors';

class GeodescriberProvider extends PureComponent {
  static propTypes = {
    getGeodescriber: PropTypes.func,
    getAdminGeodescriber: PropTypes.func,
    geojson: PropTypes.object,
    location: PropTypes.object,
    loading: PropTypes.bool,
    embed: PropTypes.bool,
  };

  componentDidMount() {
    const { location, loading, embed, geojson } = this.props;
    if (
      !loading &&
      (!['global', 'country'].includes(location.type) || embed) &&
      geojson
    ) {
      this.handleGetGeodescriber();
    }
  }

  componentDidUpdate(prevProps) {
    const { loading, geojson, location, embed } = this.props;
    const { geojson: prevGeojosn, location: prevLocation } = prevProps;

    if (
      !loading &&
      (!['global', 'country'].includes(location.type) || embed) &&
      geojson &&
      !isEqual(geojson, prevGeojosn)
    ) {
      this.handleGetGeodescriber();
    }

    if (
      !loading &&
      ['global', 'country'].includes(location.type) &&
      !isEqual(location, prevLocation) &&
      prevProps?.location?.pathname !== ''
    ) {
      this.handleGetAdminGeodescriber();
    }
  }

  handleGetGeodescriber = () => {
    const { geojson, getGeodescriber } = this.props;
    this.cancelGeodescriberFetch();
    this.geodescriberFetch = CancelToken.source();

    if (geojson) {
      getGeodescriber({
        geojson,
        token: this.geodescriberFetch.token,
        lang: 'en',
      });
    }
  };

  handleGetAdminGeodescriber = () => {
    const { getAdminGeodescriber, location } = this.props;
    this.cancelAdminGeodescriberFetch();
    this.adminGeodescriberFetch = CancelToken.source();
    getAdminGeodescriber({
      ...location,
      token: this.adminGeodescriberFetch.token,
    });
  };

  cancelGeodescriberFetch = () => {
    if (this.geodescriberFetch) {
      this.geodescriberFetch.cancel('Cancelling geodescriber fetch');
    }
  };

  cancelAdminGeodescriberFetch = () => {
    if (this.adminGeodescriberFetch) {
      this.adminGeodescriberFetch.cancel(
        'Cancelling admin geodescriber fetches'
      );
    }
  };

  render() {
    return null;
  }
}

reducerRegistry.registerModule('geodescriber', {
  actions,
  reducers,
  initialState,
});

export default connect(getGeodescriberProps, actions)(GeodescriberProvider);
