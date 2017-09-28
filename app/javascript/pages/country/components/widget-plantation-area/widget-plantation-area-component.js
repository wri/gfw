import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Tooltip, Cell }from 'recharts';
import numeral from 'numeral';

import TooltipChart from '../tooltip-chart/tooltip-chart';
import WidgetHeader from '../widget-header/widget-header';

class WidgetPlantationArea extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  render() {
    const {
      isLoading,
      countryData,
      plantationAreaData,
      startYear,
      endYear
    } = this.props;

    if (isLoading) {
      return <div>loading!</div>
    } else {
      return (
        <div className="c-widget c-widget-tree-cover-loss-areas">
          <WidgetHeader noMap title={`PLANTAtION AREA WITHIN ${countryData.name}`} />
          <div className="c-widget-tree-cover-loss-areas__container">
            <div className="c-widget-tree-cover-loss-areas__chart">
            </div>
          </div>
        </div>
      )
    }
  }
}

WidgetPlantationArea.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired,
  plantationAreaData: PropTypes.array.isRequired
};

export default WidgetPlantationArea;
