import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import actions from 'pages/map/menu/menu-actions';

import CountriesComponent from './countries-component';

const mapStateToProps = ({ countryData, mapMenu }) => {
  const { countries } = mapMenu;
  return {
    countries: countryData.countries,
    search: countries ? countries.search : null
  };
};

class CountriesContainer extends PureComponent {
  render() {
    return createElement(CountriesComponent, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps, actions)(CountriesContainer);
