import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import ForestChangeComponent from './forest-change-component';

const mapStateToProps = () => ({});

class ForestChangeContainer extends PureComponent {
  render() {
    return createElement(ForestChangeComponent, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps, null)(ForestChangeContainer);
