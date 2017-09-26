import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Header extends PureComponent {
  countriesSelectOnChange = (event) => {
    const { selectCountry } = this.props;
    selectCountry(event.target.value);
  };

  regionsSelectOnChange = (event) => {
    const { selectRegion } = this.props;
    selectRegion(event.target.value);
  };

  render() {
    const { iso, countriesList, countryRegions } = this.props;

    return (
      <div className="c-header">
        <div className="row">
          <div className="small-6 columns">
            <div className="c-header__select">
              <select value={iso} onChange={this.countriesSelectOnChange}>
                {countriesList.map((country, i) => {
                  return <option key={i} value={country.iso}>{country.name}</option>;
                })}
              </select>
            </div>
            <div className="c-header__select">
              <select value={iso} onChange={this.regionsSelectOnChange}>
                {countryRegions.map((region, i) => {
                  return <option key={i} value={region.id}>{region.name}</option>;
                })}
              </select>
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
