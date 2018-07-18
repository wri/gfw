import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import actions from './menu-actions';
import reducers, { initialState } from './menu-reducers';
import { getSections, getSectionData } from './menu-selectors';

import MenuComponent from './menu-component';

const mapStateToProps = ({ mapMenu, datasets }) => {
  const { selectedSection, countries, explore } = mapMenu;
  const selectorsParams = {
    selectedSection,
    countries,
    explore
  };
  return {
    selectedSection,
    sections: getSections(selectorsParams),
    sectionData: getSectionData(selectorsParams)
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
