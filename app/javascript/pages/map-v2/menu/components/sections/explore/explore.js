import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import * as actions from 'pages/map-v2/menu/menu-actions';
import { getData } from './explore-selectors';

import ExploreComponent from './explore-component';

const mapStateToProps = (state, { exploreSection }) => ({
  section: exploreSection,
  data: getData()
});

class ExploreContainer extends PureComponent {
  render() {
    return createElement(ExploreComponent, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps, actions)(ExploreContainer);
