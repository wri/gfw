import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import MenuComponent from './menu-component';

const mapStateToProps = () => ({});

class MenuContainer extends PureComponent {
  render() {
    return createElement(MenuComponent, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps, {})(MenuContainer);
