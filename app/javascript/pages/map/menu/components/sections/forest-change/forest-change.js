import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import { getData } from './forest-change-selectors';

import ForestChangeComponent from './forest-change-component';

const mapStateToProps = () => ({
  data: getData()
});

class ForestChangeContainer extends PureComponent {
  render() {
    return createElement(ForestChangeComponent, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps, null)(ForestChangeContainer);
