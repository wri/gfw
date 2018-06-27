import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import ExploreComponent from './explore-component';

const mapStateToProps = () => ({});

class ExploreContainer extends PureComponent {
  render() {
    return createElement(ExploreComponent, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps, null)(ExploreContainer);
