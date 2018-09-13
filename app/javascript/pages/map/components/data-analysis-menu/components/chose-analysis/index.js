import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as ownActions from 'pages/map/components/data-analysis-menu/actions';
import * as mapActions from 'components/map-v2/actions';
import * as menuActions from 'pages/map/components/menu/menu-actions';

import Component from './component';
import { getChooseAnalysisProps } from './selectors';

const actions = {
  ...mapActions,
  ...menuActions,
  ...ownActions
};

class ChoseAnalysisContainer extends PureComponent {
  static propTypes = {
    setMapSettings: PropTypes.func,
    activeDatasets: PropTypes.array,
    activeBoundary: PropTypes.object,
    boundaries: PropTypes.array
  };

  selectBoundaries = boundaryId => {
    const {
      setMapSettings,
      activeDatasets,
      activeBoundary,
      boundaries
    } = this.props;
    const boundaryItem = boundaries.find(b => b.value === boundaryId);
    const filteredLayers = activeBoundary
      ? activeDatasets.filter(l => l.dataset !== activeBoundary.dataset)
      : activeDatasets;
    if (boundaryId !== 'no-boundaries') {
      const newActiveDatasets = [
        {
          layers: [boundaryItem.layer],
          dataset: boundaryItem.dataset,
          opacity: 1,
          visibility: true
        },
        ...filteredLayers
      ];
      setMapSettings({ datasets: newActiveDatasets });
    } else {
      setMapSettings({ datasets: filteredLayers });
    }
  };

  render() {
    return createElement(Component, {
      ...this.props,
      selectBoundaries: this.selectBoundaries
    });
  }
}

export default connect(getChooseAnalysisProps, actions)(ChoseAnalysisContainer);
