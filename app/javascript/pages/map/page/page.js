import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import actions from 'components/map/map-actions';

import PageComponent from './page-component';

const mapStateToProps = ({ location, countryData, dataAnalysis }) => ({
  ...location,
  ...countryData,
  ...dataAnalysis
});

class PageContainer extends PureComponent {
  render() {
    return createElement(PageComponent, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps, actions)(PageContainer);
