import { connect } from 'react-redux';
import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import reducerRegistry from 'app/registry';

import * as shareActions from 'components/modals/share/share-actions';
import { handleLocationChange } from 'pages/dashboards/actions';
import { setSaveAOISettings } from 'components/modals/save-aoi/actions';
import * as ownActions from './actions';
import { getHeaderProps } from './selectors';
import reducers, { initialState } from './reducers';
import HeaderComponent from './component';

const actions = {
  ...ownActions,
  ...shareActions,
  handleLocationChange,
  setSaveAOISettings
};

class HeaderContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getHeaderData } = this.props;
    if (['global', 'country'].includes(location.type)) {
      getHeaderData({ ...location, ...settings });
    }
  }

  componentDidUpdate(prevProps) {
    const { location, settings, getHeaderData } = this.props;
    if (
      ['global', 'country'].includes(location.type) &&
      !isEqual(location, prevProps.location)
    ) {
      getHeaderData({ ...location, ...settings });
    }
  }

  render() {
    return createElement(HeaderComponent, {
      ...this.props
    });
  }
}

HeaderContainer.propTypes = {
  location: PropTypes.object.isRequired,
  getHeaderData: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired
};

HeaderContainer.defaultProps = {
  settings: {
    threshold: 30
  }
};

reducerRegistry.registerModule('header', {
  actions: ownActions,
  reducers,
  initialState
});

export default connect(getHeaderProps, actions)(HeaderContainer);
