import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widget-header';
import WidgetPaginate from 'pages/country/widget-paginate';
import WidgetPlantationAreaSettings from './widget-plantation-area-settings-component';

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
      settings,
      units,
      paginate,
      nextPage,
      previousPage,
      setPlantationAreaSettingsUnit
    } = this.props;

    const paginateFrom = paginate.page * paginate.limit - paginate.limit;
    const paginateTo = paginateFrom + paginate.limit;

    return (
      <div className="c-widget c-widget-plantation-area">
        <WidgetHeader
          noMap
          title={`PLANTATION AREA WITHIN ${countryData.name}`}
        >
          <WidgetPlantationAreaSettings
            type="settings"
            units={units}
            settings={settings}
            onUnitChange={setPlantationAreaSettingsUnit}
          />
        </WidgetHeader>
        {isLoading ? (
          <Loader isAbsolute />
        ) : (
          <div className="c-widget-plantation-area__container">
            <ul className="c-widget-plantation-area__chart">
              {plantationAreaData
                .slice(paginateFrom, paginateTo)
                .map((item, index) => (
                  <li key={index}>
                    <div className="c-widget-plantation-area__legend">
                      <div className="circle">{index + 1}</div>
                      <div className="title">{item.name}</div>
                    </div>
                    <div className="chart-container">
                      <ResponsiveContainer height={10} width={'100%'}>
                        <BarChart
                          layout="vertical"
                          data={plantationAreaData}
                          stackOffset="expand"
                          barSize={10}
                        >
                          <XAxis hide type="number" />
                          <YAxis hide type="category" />
                          <Bar
                            dataKey={`one_${index}`}
                            fill="#fba79f"
                            stackId="a"
                          />
                          <Bar
                            dataKey={`two_${index}`}
                            fill="#d29eea"
                            stackId="a"
                          />
                          <Bar
                            dataKey={`three_${index}`}
                            fill="#99cf95"
                            stackId="a"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="text-percentage">2%</div>
                    </div>
                  </li>
                ))}
            </ul>
            <WidgetPaginate
              paginate={paginate}
              count={plantationAreaData.length}
              onClickNextPage={nextPage}
              onClickPreviousPage={previousPage}
            />
          </div>
        )}
      </div>
    );
  }
}

WidgetPlantationArea.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired,
  plantationAreaData: PropTypes.array.isRequired
};

export default WidgetPlantationArea;
