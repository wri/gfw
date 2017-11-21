import { createElement } from 'react';
import { connect } from 'react-redux';

import HeaderComponent from './header-component';
import actions from './header-actions';

import { getTotalCover } from '../../../../services/tree-cover';
import { getTreeLossByYear } from '../../../../services/tree-loss';

export { initialState } from './header-reducers';
export { default as reducers } from './header-reducers';
export { default as actions } from './header-actions';

const mapStateToProps = state => ({
  iso: state.root.iso,
  countryRegion: state.root.countryRegion,
  countriesList: state.root.countriesList,
  countryData: state.root.countryData,
  countryRegions: state.root.countryRegions,
  selectedCountry: state.header.selectedCountry,
  selectedRegion: state.header.selectedRegion,
  countrySelectData: state.header.countrySelectData,
  regionSelectData: state.header.regionSelectData,
  totalCoverHeader: state.header.totalCoverHeader,
  totalForestHeader: state.header.totalForestHeader,
  percentageForestHeader: state.header.percentageForestHeader,
  totalCoverLoss: state.header.totalCoverLoss
});

const HeaderContainer = props => {
  const setInitialData = () => {
    const {
      iso,
      countryRegion,
      countriesList,
      countryRegions,
      countryData,
      setHeaderValues
    } = props;

    let selectedCountry = '';
    const countrySelectData = countriesList.map(item => {
      if (iso === item.iso) {
        selectedCountry = item.name;
      }

      return {
        value: item.iso,
        label: item.name
      };
    });

    let selectedRegion = 'Jurisdiction';
    const regionSelectData = countryRegions.map(item => {
      if (countryRegion === item.id) {
        selectedRegion = item.name;
      }

      return {
        value: item.id,
        label: item.name
      };
    });

    getTotalCover(iso, countryRegion, 30).then(totalCoverResponse => {
      getTreeLossByYear(
        iso,
        countryRegion,
        { minYear: 2015, maxYear: 2015 },
        30
      ).then(coverLoss => {
        const totalCover = Math.round(totalCoverResponse.data.data[0].value);
        const values = {
          selectedCountry,
          selectedRegion,
          countrySelectData,
          regionSelectData,
          totalCoverHeader:
            countryRegion === 0
              ? countryData.area_ha
              : countryRegions[countryRegion - 1].area_ha,
          totalForestHeader: totalCover,
          percentageForestHeader:
            countryRegion === 0
              ? totalCover / Math.round(countryData.area_ha) * 100
              : totalCover /
                Math.round(countryRegions[countryRegion - 1].area_ha) *
                100,
          totalCoverLoss: coverLoss.data.data[0].value
        };
        setHeaderValues(values);
      });
    });
  };

  return createElement(HeaderComponent, {
    ...props,
    setInitialData
  });
};

export default connect(mapStateToProps, actions)(HeaderContainer);
