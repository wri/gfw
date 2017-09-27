import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-me';

class Header extends PureComponent {
  countriesSelectOnChange = (event) => {
    const { selectCountry } = this.props;
    selectCountry(event.value);
  };

  regionsSelectOnChange = (event) => {
    const { selectRegion } = this.props;
    selectRegion(event.value);
  };

  render() {
    const countries = [];
    const regions = [];
    let countrySelected = '';
    let regionSelected = 'Jurisdiction';
    const { iso, countriesList, countryRegions, match } = this.props;
    countriesList.forEach(function(item){
      if(iso === item.iso) {
        countrySelected = item.name
      }
      countries.push({value: item.iso, label: item.name});
    });
    countryRegions.forEach(function(item){
      if (match.params.region) {
        if(match.params.region === item.id.toString()) {
          regionSelected = item.name;
        }
      }
      regions.push({value: item.id, label: item.name});
    });
    return (
      <div className="c-header">
        <div className="row">
          <div className="small-6 columns">
            <div className="c-header__select">
              <svg className="icon icon-angle-arrow-down c-header__select-arrow"><use xlinkHref="#icon-angle-arrow-down"></use></svg>
              <Select value={countrySelected} options={countries} onChange={this.countriesSelectOnChange} />
            </div>
            <div className="c-header__select">
              <svg className="icon icon-angle-arrow-down c-header__select-arrow"><use xlinkHref="#icon-angle-arrow-down"></use></svg>
              <Select value={regionSelected} options={regions} onChange={this.regionsSelectOnChange} />
            </div>
          </div>
          <div className="small-6 columns c-header__info">
            <p>In 2010, this country had <strong>519 MHa</strong> tree cover, that represents <strong>61%</strong> of its <strong>851 Mha.</strong></p>
            <p>Excluding plantations, <strong>40 MHa</strong> of tree cover loss occured in <strong>2016.</strong></p>
          </div>
        </div>
        <div className="c-header__tabs">
          <div className="row">
            <ul>
              <li className="-selected">Summary</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

Header.propTypes = {
  iso: PropTypes.string.isRequired,
  countriesList: PropTypes.array.isRequired,
  countryRegions: PropTypes.array.isRequired,
  selectCountry: PropTypes.func.isRequired,
  selectRegion: PropTypes.func.isRequired,
  history: PropTypes.object
};

export default Header;
