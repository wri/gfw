import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { CancelToken } from 'axios';

import * as actions from './menu-actions';
import reducers, { initialState } from './menu-reducers';
import { getMenuProps } from './menu-selectors';
import MenuComponent from './menu-component';

class MenuContainer extends PureComponent {
  componentDidMount() {
    const { search } = this.props;
    if (search) {
      this.handleGetLocations(search);
    }
  }

  handleGetLocations = debounce(search => {
    if (this.searchFetch) {
      this.searchFetch.cancel();
    }
    this.searchFetch = CancelToken.source();
    this.props.getLocationFromSearch({ search, token: this.searchFetch.token });
  }, 300);

  handleSearchChange = value => {
    const { setMenuSettings, setMenuLoading } = this.props;
    setMenuSettings({ search: value });
    if (value) {
      setMenuLoading(true);
      this.handleGetLocations(value);
    }
  };

  render() {
    return createElement(MenuComponent, {
      ...this.props,
      handleSearchChange: this.handleSearchChange
    });
  }
}

MenuContainer.propTypes = {
  getLocationFromSearch: PropTypes.func,
  setMenuSettings: PropTypes.func,
  setMenuLoading: PropTypes.func,
  search: PropTypes.string
};

export const reduxModule = { actions, reducers, initialState };
export default connect(getMenuProps, actions)(MenuContainer);
