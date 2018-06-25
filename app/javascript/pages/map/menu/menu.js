import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import actions from './menu-actions';
import reducers, { initialState } from './menu-reducers';
import { getSections } from './menu-selectors';

import MenuComponent from './menu-component';

const mapStateToProps = ({ mapMenu }) => {
  const { selectedSection } = mapMenu;
  return {
    sections: getSections(),
    selectedSection
  };
};

class MenuContainer extends PureComponent {
  render() {
    return createElement(MenuComponent, {
      ...this.props
    });
  }
}

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(MenuContainer);
