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
    loading: PropTypes.bool,
    lang: PropTypes.string
  };

  componentDidMount() {
    const { location, loading, geojson } = this.props;

    if (!loading && !['global', 'country'].includes(location.type) && geojson) {
      this.handleGetGeodescriber();
    }

    if (!loading && ['global', 'country'].includes(location.type)) {
      this.handleGetAdminGeodescriber();
    }
  }

  componentDidUpdate(prevProps) {
    const { loading, geojson, location, lang } = this.props;
    const {
      geojson: prevGeojosn,
      location: prevLocation,
      lang: prevLang
    } = prevProps;

    if (
      !loading &&
      !['global', 'country'].includes(location.type) &&
      ((geojson && !isEqual(geojson, prevGeojosn)) || !isEqual(lang, prevLang))
    ) {
      this.handleGetGeodescriber();
    }

    if (
      !loading &&
      ['global', 'country'].includes(location.type) &&
      !isEqual(location, prevLocation)
    ) {
      this.handleGetAdminGeodescriber();
    }
  }

  handleGetGeodescriber = () => {
    const { lang, geojson, getGeodescriber } = this.props;
    this.cancelGeodescriberFetch();
    this.geodescriberFetch = CancelToken.source();

    if (geojson) {
      getGeodescriber({ geojson, token: this.geodescriberFetch.token, lang });
    }
  };

  handleGetAdminGeodescriber = () => {
    const { getAdminGeodescriber } = this.props;
    this.cancelAdminGeodescriberFetch();
    this.adminGeodescriberFetch = CancelToken.source();

    getAdminGeodescriber({
      ...location,
      token: this.geodescriberFetch.token
    });
  };

  cancelGeodescriberFetch = () => {
    if (this.geodescriberFetch) {
      this.geodescriberFetch.cancel();
    }
  };

  cancelAdminGeodescriberFetch = () => {
    if (this.adminGeodescriberFetch) {
      this.adminGeodescriberFetch.cancel();
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
