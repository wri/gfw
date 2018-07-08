import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import actions from 'pages/map/data-analysis-menu/actions';

import Component from './polygon-analysis-component';

const mapStateToProps = ({ dataAnalysis }) => ({
  analysis: dataAnalysis.analysis
});

class PolygonAnalysisContainer extends PureComponent {
  componentDidMount() {
    const { setAnalysisData } = this.props;
    setAnalysisData({
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [-7.8772, 40.2166],
            [-7.2565, 40.1579],
            [-7.2784, 39.8845],
            [-7.6135, 39.8507],
            [-7.8772, 40.2166]
          ]
        ]
      }
    });
  }

  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

PolygonAnalysisContainer.propTypes = {
  setAnalysisData: PropTypes.func
};

export default connect(mapStateToProps, actions)(PolygonAnalysisContainer);
