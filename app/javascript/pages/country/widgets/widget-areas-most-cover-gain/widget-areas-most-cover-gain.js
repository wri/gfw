import { createElement } from 'react';
import { connect } from 'react-redux';

import { getGain } from 'services/forest-data';
import { getUnits } from 'pages/country/utils/filters';

import WidgetAreasMostCoverGainComponent from './widget-areas-most-cover-gain-component';
import actions from './widget-areas-most-cover-gain-actions';

export { initialState } from './widget-areas-most-cover-gain-reducers';
export { default as reducers } from './widget-areas-most-cover-gain-reducers';
export { default as actions } from './widget-areas-most-cover-gain-actions';

const mapStateToProps = state => ({
  location: state.location.payload,
  admin1List: state.countryData.regions,
  isLoading: state.widgetAreasMostCoverGain.isLoading,
  areaData: state.widgetAreasMostCoverGain.areaData,
  areaChartData: state.widgetAreasMostCoverGain.areaChartData,
  paginate: state.widgetAreasMostCoverGain.paginate,
  locations: state.widgetAreasMostCoverGain.locations,
  units: getUnits(),
  settings: state.widgetAreasMostCoverGain.settings
});

const colors = [
  '#110f74',
  '#2422a2',
  '#4c49d1',
  '#6f6de9',
  '#a3a1ff',
  '#cdcdfe',
  '#ddddfc',
  '#e7e5a4',
  '#dad781',
  '#cecb65',
  '#d1d1d1'
];

const WidgetAreasMostCoverGainContainer = props => {
  const updateData = newProps => {
    newProps.setAreasMostCoverIsLoading(true);
    setWidgetData(newProps);
  };

  const setInitialData = nextProps => {
    setWidgetData(nextProps);
  };

  const setWidgetData = newProps => {
    const {
      location,
      admin1List,
      settings,
      paginate,
      setAreasMostCoverGainValues
    } = newProps;

    getGain(
      { minYear: settings.startYear, maxYear: settings.endYear },
      settings.canopy
    ).then(totalCoverGain => {
      getGain(
        location.admin0,
        { minYear: settings.startYear, maxYear: settings.endYear },
        settings.canopy
      ).then(treeCoverGainByRegion => {
        const regionsCoverGain = [];
        const regionCoverGainChart = [];

        let indexColors = 0;
        let othersValue = 0;
        treeCoverGainByRegion.data.data.forEach((item, index) => {
          const numberRegion = admin1List.find(x => x.id === item.adm1);

          regionsCoverGain.push({
            name: admin1List[numberRegion].name,
            value: item.value,
            color: colors[indexColors],
            position: index + 1
          });

          if (indexColors < paginate.limit) {
            regionCoverGainChart.push({
              name: admin1List[numberRegion].name,
              color: colors[indexColors],
              value:
                settings.unit === 'ha'
                  ? item.value
                  : item.value / totalCoverGain.data.data[0].value * 100
            });
            indexColors += 1;
          } else if (index === treeCoverGainByRegion.data.data.length - 1) {
            regionCoverGainChart.push({
              name: 'others',
              color: colors[indexColors],
              value:
                settings.unit === 'ha'
                  ? othersValue
                  : othersValue / totalCoverGain.data.data[0].value * 100
            });
          } else {
            othersValue += item.value;
          }
        });

        setAreasMostCoverGainValues({
          data: regionsCoverGain,
          charData: regionCoverGainChart
        });
      });
    });
  };

  const nextPage = () => {
    const { paginate, setAreasMostCoverGainPage } = props;
    setAreasMostCoverGainPage(paginate.page + 1);
  };

  const previousPage = () => {
    const { paginate, setAreasMostCoverGainPage } = props;
    setAreasMostCoverGainPage(paginate.page - 1);
  };

  return createElement(WidgetAreasMostCoverGainComponent, {
    ...props,
    setInitialData,
    updateData,
    nextPage,
    previousPage
  });
};

export default connect(mapStateToProps, actions)(
  WidgetAreasMostCoverGainContainer
);
