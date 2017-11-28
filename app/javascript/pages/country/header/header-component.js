import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-me';

import Loader from 'components/loader/loader';

class Header extends PureComponent {
  componentWillUpdate(nextProps) {
    const { isRootLoading, setInitialData } = this.props;
    if (!nextProps.isRootLoading && isRootLoading) {
      setInitialData(nextProps);
    }
  }

  admin0SelectOnChange = event => {
    const { setInitialState, setAdmin0 } = this.props;
    setAdmin0(event.value);
    setInitialState();
  };

  admin1SelectOnChange = event => {
    const { location, setInitialState, setAdmin1 } = this.props;
    setAdmin1(location.admin0, event.value);
    setInitialState();
  };

  admin2SelectOnChange = event => {
    const { location, setInitialState, setAdmin2 } = this.props;
    setAdmin2(location.admin0, location.admin1, event.value);
    setInitialState();
  };

  render() {
    const {
      isRootLoading,
      location,
      selectedAdmin0,
      selectedAdmin1,
      selectedAdmin2,
      admin0SelectData,
      admin1SelectData,
      admin2SelectData
    } = this.props;

    if (isRootLoading) {
      return <Loader parentClass="c-header" isAbsolute />;
    }

    return (
      <div className="c-header">
        <div className="row">
          <div className="large-6 medium-12 small-12 columns container-select">
            <div className="c-header__select">
              <svg className="icon icon-angle-arrow-down c-header__select-arrow">
                <use xlinkHref="#icon-angle-arrow-down" />
              </svg>
              <Select
                value={selectedAdmin0}
                options={admin0SelectData}
                onChange={this.admin0SelectOnChange}
              />
            </div>
            <div className="c-header__select -jurisdiction">
              <svg className="icon icon-angle-arrow-down c-header__select-arrow">
                <use xlinkHref="#icon-angle-arrow-down" />
              </svg>
              <Select
                value={selectedAdmin1}
                options={admin1SelectData}
                onChange={this.admin1SelectOnChange}
              />
            </div>
            {location.admin1 ? (
              <div className="c-header__select -jurisdiction">
                <svg className="icon icon-angle-arrow-down c-header__select-arrow">
                  <use xlinkHref="#icon-angle-arrow-down" />
                </svg>
                <Select
                  value={selectedAdmin2}
                  options={admin2SelectData}
                  onChange={this.admin2SelectOnChange}
                />
              </div>
            ) : null}
          </div>
          <div className="large-6 medium-12 small-12 columns c-header__info">
            <p>
              In 2010, <strong>this</strong>
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
  isRootLoading: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  selectedAdmin0: PropTypes.string.isRequired,
  selectedAdmin1: PropTypes.string.isRequired,
  selectedAdmin2: PropTypes.string.isRequired,
  admin0SelectData: PropTypes.array.isRequired,
  admin1SelectData: PropTypes.array.isRequired,
  admin2SelectData: PropTypes.array.isRequired,
  setInitialData: PropTypes.func.isRequired,
  setInitialState: PropTypes.func.isRequired,
  setAdmin0: PropTypes.func.isRequired,
  setAdmin1: PropTypes.func.isRequired,
  setAdmin2: PropTypes.func.isRequired
};

export default Header;
