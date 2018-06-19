import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import PageComponent from './page-component';

const mapStateToProps = () => ({});

class PageContainer extends PureComponent {
  render() {
    return createElement(PageComponent, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps, null)(PageContainer);
