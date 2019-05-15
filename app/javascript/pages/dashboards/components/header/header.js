import { connect } from 'react-redux';
import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import reducerRegistry from 'app/registry';

import * as shareActions from 'components/modals/share/share-actions';
import * as ownActions from './header-actions';
import { getHeaderProps } from './header-selectors';
import reducers, { initialState } from './header-reducers';
import HeaderComponent from './header-component';

const actions = { ...ownActions, ...shareActions };

class HeaderContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getHeaderData } = this.props;
    getHeaderData({ ...location, ...settings });
  }

  componentDidUpdate(prevProps) {
    const { location, settings, getHeaderData } = this.props;
    if (!isEqual(location, prevProps.location)) {
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

reducerRegistry.registerModule('header', {
  actions: ownActions,
  reducers,
  initialState
});

export default connect(getHeaderProps, actions)(HeaderContainer);
