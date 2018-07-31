import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import { getLayers } from 'components/map/map-selectors';

import { getParsedDatasets } from './selectors';
import ForestChangeComponent from './component';

const mapStateToProps = ({ datasets, location, mapMenu }) => ({
  datasets: getParsedDatasets({ ...datasets, category: mapMenu.selectedSection }),
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
