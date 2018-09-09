import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import { getPageProps } from './selectors';
import PageComponent from './component';

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

export default connect(getPageProps)(PageContainer);
