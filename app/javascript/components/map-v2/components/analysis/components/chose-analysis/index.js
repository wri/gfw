import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as ownActions from 'components/map-v2/components/analysis/actions';
import * as modalActions from 'components/modals/sources/actions';
import * as mapActions from 'components/map-v2/actions';
import * as menuActions from 'pages/map/components/menu/menu-actions';

import Component from './component';
import { getChooseAnalysisProps } from './selectors';
import uploadConfig from '../../upload-config.json';

const actions = {
  ...mapActions,
  ...modalActions,
  ...menuActions,
  ...ownActions
};

class ChoseAnalysisContainer extends PureComponent {
  static propTypes = {
    setMapSettings: PropTypes.func,
    uploadShape: PropTypes.func,
    activeDatasets: PropTypes.array,
    activeBoundary: PropTypes.object,
    boundaries: PropTypes.array,
    setAnalysisLoading: PropTypes.func
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

  onDrop = files => {
    const { uploadShape, setAnalysisLoading } = this.props;
    if (files && files.length) {
      const file = files[0];
      if (file.size > uploadConfig.sizeLimit) {
        setAnalysisLoading({
          error: `File larger than ${uploadConfig.sizeLimit / 1000000}MB`,
          errorMessage: ''
        });
      } else {
        uploadShape(file);
      }
    } else {
      setAnalysisLoading({ error: 'Invalid file type', errorMessage: '' });
    }
  };

  render() {
    return createElement(Component, {
      ...this.props,
      selectBoundaries: this.selectBoundaries,
      uploadShape: this.uploadShape,
      onDrop: this.onDrop,
      uploadConfig
    });
  }
}

export default connect(getChooseAnalysisProps, actions)(ChoseAnalysisContainer);
