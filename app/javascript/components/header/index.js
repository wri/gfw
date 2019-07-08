import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import { setModalContactUsOpen } from 'components/modals/contact-us/actions';

import config from './config';
import Component from './component';
import * as actions from './actions';

class HeaderContainer extends PureComponent {
  toggleMenu = () => {
    this.setState({ showHeader: !this.state.showHeader });
  };

  render() {
    return createElement(Component, {
      ...this.state,
      ...this.props,
      ...config,
      toggleMenu: this.toggleMenu
    });
  }
}

export default connect(null, { setModalContactUsOpen, ...actions })(
  HeaderContainer
);
