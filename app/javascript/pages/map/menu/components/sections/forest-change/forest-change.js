import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import { getLayers } from 'components/map/map-selectors';
import { getParsedDatasets } from './forest-change-selectors';

import ForestChangeComponent from './forest-change-component';

const mapStateToProps = ({ datasets, location }) => ({
  datasets: getParsedDatasets({ ...datasets }),
  layers: getLayers({ ...location })
});

class ForestChangeContainer extends PureComponent {
  render() {
    return createElement(ForestChangeComponent, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps, null)(ForestChangeContainer);
