import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widgets/widget-header';
import WidgetPaginate from 'pages/country/widgets/widget-paginate';
import WidgetPlantationAreaSettings from './widget-plantation-area-settings-component';
import './widget-plantation-area-styles.scss';

class WidgetPlantationArea extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  render() {
    const {
      locationNames,
      isLoading,
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
          title={`TREE PLANTATION AREA WITHIN ${locationNames.country &&
            locationNames.country.label}`}
          shareAnchor={'plantation-area'}
        >
          <WidgetPlantationAreaSettings
            type="settings"
            units={units}
            settings={settings}
            onUnitChange={setPlantationAreaSettingsUnit}
          />
        </WidgetHeader>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="c-widget-plantation-area__container">
            <ul className="c-widget-plantation-area__chart">
              {plantationAreaData
                .slice(paginateFrom, paginateTo)
                .map((item, index) => (
                  <li key={item.name}>
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
  locationNames: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired,
  plantationAreaData: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  units: PropTypes.array.isRequired,
  paginate: PropTypes.object.isRequired,
  nextPage: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  setPlantationAreaSettingsUnit: PropTypes.func.isRequired
};

export default WidgetPlantationArea;
