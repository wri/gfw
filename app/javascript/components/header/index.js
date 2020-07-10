import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import { setModalContactUsOpen } from 'components/modals/contact-us/actions';

import config from './config';
import Component from './component';

class HeaderContainer extends PureComponent {
  toggleMenu = () => {
    const { showHeader } = this.state;
    this.setState({ showHeader: !showHeader });
  };

  render() {
    return createElement(Component, {
      ...this.state,
      ...this.props,
      ...config,
      toggleMenu: this.toggleMenu,
    });
  }
}

export default connect(null, { openContactUsModal: setModalContactUsOpen })(
  HeaderContainer
);
