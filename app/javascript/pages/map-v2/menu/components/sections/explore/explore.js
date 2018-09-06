import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import * as actions from 'pages/map-v2/menu/menu-actions';
import { mapStateToProps } from './explore-selectors';

import ExploreComponent from './explore-component';

class ExploreContainer extends PureComponent {
  render() {
    return createElement(ExploreComponent, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps, actions)(ExploreContainer);
