import { connect } from 'react-redux';
import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

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

  componentWillReceiveProps(nextProps) {
    const { location, settings, getHeaderData } = nextProps;
    if (!isEqual(location, this.props.location)) {
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

export const reduxModule = { actions, reducers, initialState };

export default connect(getHeaderProps, actions)(HeaderContainer);
