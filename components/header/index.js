import { createElement, PureComponent } from 'react';

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

export default HeaderContainer;
