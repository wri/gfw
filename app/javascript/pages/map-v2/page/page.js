import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import actions from 'components/map-v2/actions';

import PageComponent from './page-component';

const mapStateToProps = ({ location, countryData, dataAnalysis, myGfw }) => ({
  ...location,
  ...countryData,
  ...dataAnalysis,
  loggedIn: !isEmpty(myGfw.data)
});

class PageContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showHeader: false
    };
  }

  handleShowMenu = () => {
    const { showHeader } = this.state;
    this.setState({ showHeader: !showHeader });
  };

  render() {
    return createElement(PageComponent, {
      ...this.props,
      ...this.state,
      handleShowMenu: this.handleShowMenu
    });
  }
}

export default connect(mapStateToProps, actions)(PageContainer);
