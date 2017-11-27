import { createElement } from 'react';
import { connect } from 'react-redux';

import { getTotalCover } from 'services/tree-cover';
import { getTreeLossByYear } from 'services/tree-loss';

import HeaderComponent from './header-component';
import actions from './header-actions';

export { initialState } from './header-reducers';
export { default as reducers } from './header-reducers';
export { default as actions } from './header-actions';

const mapStateToProps = state => ({
  iso: state.root.iso,
  admin1: state.root.admin1,
  admin2: state.root.admin2,
  countryData: state.root.countryData,
  admin0List: state.root.admin0List,
  admin1List: state.root.admin1List,
  admin2List: state.root.admin2List,
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
      admin1,
      countryData,
      admin0List,
      admin1List,
      setHeaderValues
    } = props;

    let selectedCountry = '';
    const countrySelectData = admin0List.map(item => {
      if (iso === item.iso) {
        selectedCountry = item.name;
      }

      return {
        value: item.iso,
        label: item.name
      };
    });

    let selectedRegion = 'Select Region';
    const regionSelectData = admin1List.map(item => {
      if (admin1 === item.id) {
        selectedRegion = item.name;
      }

      return {
        value: item.id,
        label: item.name
      };
    });

    getTotalCover(iso, admin1, 30).then(totalCoverResponse => {
      getTreeLossByYear(
        iso,
        admin1,
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
          admin1 === 0
            ? countryData.area_ha
            : admin1List[admin1 - 1].area_ha,
          totalForestHeader: totalCover,
          percentageForestHeader:
            admin1 === 0
              ? totalCover / Math.round(countryData.area_ha) * 100
              : totalCover /
                Math.round(admin1List[admin1 - 1].area_ha) *
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
