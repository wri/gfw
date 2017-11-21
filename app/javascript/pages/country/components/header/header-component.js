import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-me';
import numeral from 'numeral';

class Header extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  countriesSelectOnChange = event => {
    const { setInitialState, selectCountry } = this.props;
    selectCountry(event.value);
    setInitialState();
  };

  regionsSelectOnChange = event => {
    const { iso, setInitialState, selectRegion } = this.props;
    selectRegion(iso, event.value);
    setInitialState();
  };

  render() {
    const {
      countryRegion,
      selectedCountry,
      selectedRegion,
      countrySelectData,
      regionSelectData,
      totalCoverHeader,
      totalForestHeader,
      percentageForestHeader,
      totalCoverLoss
    } = this.props;

    return (
      <div className="c-header">
        <div className="row">
          <div className="large-6 medium-12 small-12 columns container-select">
            <div className="c-header__select">
              <svg className="icon icon-angle-arrow-down c-header__select-arrow">
                <use xlinkHref="#icon-angle-arrow-down" />
              </svg>
              <Select
                value={selectedCountry}
                options={countrySelectData}
                onChange={this.countriesSelectOnChange}
              />
            </div>
            <div className="c-header__select -jurisdiction">
              <svg className="icon icon-angle-arrow-down c-header__select-arrow">
                <use xlinkHref="#icon-angle-arrow-down" />
              </svg>
              <Select
                value={selectedRegion}
                options={regionSelectData}
                onChange={this.regionsSelectOnChange}
              />
            </div>
          </div>
          <div className="large-6 medium-12 small-12 columns c-header__info">
            <p>
              In 2010, this {!countryRegion ? 'country' : 'jurisdiction'} had{' '}
              <strong>
                {numeral(Math.round(totalForestHeader / 1000000)).format('0,0')}{' '}
                MHa
              </strong>{' '}
              tree cover, that represents{' '}
              <strong>
                {numeral(Math.round(percentageForestHeader)).format('0,0')}%
              </strong>{' '}
              of its
              <strong>
                {' '}
                {numeral(Math.round(totalCoverHeader / 1000000)).format(
                  '0,0'
                )}{' '}
                MHa.
              </strong>
            </p>
            <p>
              Excluding plantations,{' '}
              <strong>
                {numeral(Math.round(totalCoverLoss / 1000)).format('0,0')} Ha
              </strong>{' '}
              of tree cover loss occured in <strong>2015.</strong>
            </p>
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
    );
  }
}

Header.propTypes = {
  iso: PropTypes.string.isRequired,
  countryRegion: PropTypes.number.isRequired,
  setInitialData: PropTypes.func.isRequired,
  setInitialState: PropTypes.func.isRequired,
  selectCountry: PropTypes.func.isRequired,
  selectRegion: PropTypes.func.isRequired,
  selectedCountry: PropTypes.string.isRequired,
  selectedRegion: PropTypes.string.isRequired,
  countrySelectData: PropTypes.array.isRequired,
  regionSelectData: PropTypes.array.isRequired,
  totalCoverHeader: PropTypes.number.isRequired,
  totalForestHeader: PropTypes.number.isRequired,
  percentageForestHeader: PropTypes.number.isRequired,
  totalCoverLoss: PropTypes.number.isRequired
};

export default Header;
