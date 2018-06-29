import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import actions from './menu-actions';
import reducers, { initialState } from './menu-reducers';
import { getSections, getSectionData } from './menu-selectors';

import MenuComponent from './menu-component';

const mapStateToProps = ({ mapMenu }) => {
  const { selectedSection, countries } = mapMenu;
  const selectorsParams = {
    selectedSection,
    countries
  };
  return {
    selectedSection,
    sections: getSections(selectorsParams),
    selectedSectionData: getSectionData(selectorsParams)
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
