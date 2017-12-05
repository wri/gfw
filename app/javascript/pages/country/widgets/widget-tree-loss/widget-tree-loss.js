import { createElement } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import numeral from 'numeral';

import { getExtent } from 'services/forest-data';

import WidgetTreeLossComponent from './widget-tree-loss-component';
import actions from './widget-tree-loss-actions';

export { initialState } from './widget-tree-loss-reducers';
export { default as reducers } from './widget-tree-loss-reducers';
export { default as actions } from './widget-tree-loss-actions';

const mapStateToProps = state => ({
  location: state.location.payload,
  areaHa: state.countryData.geostore.areaHa,
  isLoading: state.widgetTreeLoss.isLoading,
  loss: state.widgetTreeLoss.loss,
  lossSentence: state.widgetTreeLoss.lossSentence,
  treeExtent: state.widgetTreeLoss.treeExtent,
  yearsLoss: state.widgetTreeLoss.yearsLoss,
  indicators: state.widgetTreeLoss.indicators,
  canopies: state.widgetTreeLoss.canopies,
  settings: state.widgetTreeLoss.settings
});

const WidgetTreeLossContainer = props => {
  const updateData = nextProps => {
    nextProps.setTreeLossIsLoading(true);
    setWidgetData(nextProps);
  };

  const setInitialData = nextProps => {
    setWidgetData(nextProps);
  };

  const setWidgetData = nextProps => {
    const { location, settings, setTreeLossValues } = nextProps;

    axios
      .all([
        getExtent(
          location.country,
          location.region,
          location.subRegion,
          settings.indicator,
          {
            minYear: settings.startYear,
            maxYear: settings.endYear
          },
          settings.canopy
        ),
        getExtent(
          location.country,
          location.region,
          location.subRegion,
          settings.indicator,
          settings.canopy
        )
      ])
      .then(
        axios.spread((getTreeLossByYearResponse, getExtentResponse) => {
          const treeExtent = getExtentResponse.data.data[0].value;
          const loss = getTreeLossByYearResponse.data.data;
          setTreeLossValues({
            loss,
            lossSentence: getSentence(nextProps, loss, treeExtent),
            treeExtent
          });
        })
      );
  };

  const getSentence = (nextProps, loss, treeExtent) => {
    const { locationNames, indicators, settings } = nextProps;

    const totalLoss = loss.reduce(
      (sum, item) => (typeof sum === 'object' ? sum.area : sum) + item.area
    );
    const totalEmissions = loss.reduce(
      (sum, item) =>
        (typeof sum === 'object' ? sum.emissions : sum) + item.emissions
    );
    const indicator = indicators.filter(
      item => item.value === settings.indicator
    );

    const locationText = locationNames.region
      ? `${indicator[0].label} of ${
        locationNames.subRegion
          ? locationNames.subRegion.label
          : locationNames.region.label
      } `
      : `${locationNames.country.label} (${indicator[0].label.toLowerCase()}) `;

    return `Between ${settings.startYear} and ${settings.endYear}, ${
      locationText
    } lost ${numeral(totalLoss).format(
      '0,0'
    )} ha of tree cover: This loss is equal to ${numeral(
      totalLoss / (treeExtent * 100)
    ).format(
      '0.0'
    )}% of the total ${indicator[0].label.toLowerCase()} tree cover extent in 2010, and equivalent to ${numeral(
      totalEmissions
    ).format('0,0')} tonnes of CO\u2082 emissions.`;
  };

  const viewOnMap = () => {
    props.setLayers(['loss']);
  };

  return createElement(WidgetTreeLossComponent, {
    ...props,
    setInitialData,
    viewOnMap,
    updateData,
    getSentence
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeLossContainer);
