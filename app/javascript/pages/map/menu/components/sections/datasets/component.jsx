import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import NoContent from 'components/ui/no-content';

import LayerToggle from 'components/map/components/legend/components/layer-toggle';
import MenuBlock from 'pages/map/menu/components/menu-block';
import Pill from 'components/ui/pill';
import Dropdown from 'components/ui/dropdown';

import './styles.scss';

class Datasets extends PureComponent {
  handleRemoveCountry = iso => {
    const { selectedCountries, setMenuSettings } = this.props;
    const newCountries = selectedCountries.filter(c => c.value !== iso);
    setMenuSettings({
      selectedCountries: newCountries ? newCountries.map(nc => nc.value) : []
    });
  };

  handleAddCountry = country => {
    const { selectedCountries, setMenuSettings } = this.props;
    setMenuSettings({
      selectedCountries: [...selectedCountries.map(c => c.value), country.value]
    });
  };

  render() {
    const {
      name,
      datasets,
      subCategories,
      onToggleLayer,
      onInfoClick,
      countries,
      selectedCountries,
      countriesWithoutData
    } = this.props;

    return (
      <div className="c-datasets">
        <div className="countries-selection">
          <span className="sub-title">country-specific data</span>
          <div className="pills">
            {selectedCountries &&
              selectedCountries.map(c => (
                <Pill
                  key={c.value}
                  active={!countriesWithoutData.includes(c.label)}
                  label={c.label}
                  onRemove={() => this.handleRemoveCountry(c.value)}
                >
                  {c.label}
                </Pill>
              ))}
            {countries && (
              <Dropdown
                className="country-dropdown"
                theme="theme-dropdown-button theme-dropdown-button-small"
                placeholder="+ Add country"
                noItemsFound="No country found"
                noSelectedValue="+ Add country"
                options={countries}
                onChange={this.handleAddCountry}
                searchable
              />
            )}
          </div>
        </div>
        {!!countriesWithoutData.length &&
          !!selectedCountries.length && (
            <p className="no-datasets-message">
              No datasets available for{' '}
              {countriesWithoutData.map((c, i, a) => (
                <Fragment key={c}>
                  <strong>{c}</strong>
                  {`${i !== a.length - 1 ? ', ' : ''}`}
                </Fragment>
              ))}{' '}
              in {name && name.toLowerCase()}.
            </p>
          )}
        {subCategories
          ? subCategories.map(subCat => (
            <MenuBlock key={subCat.slug} {...subCat}>
              {!isEmpty(subCat.datasets) ? (
                subCat.datasets.map(d => (
                  <LayerToggle
                    key={d.id}
                    className="dataset-toggle"
                    data={{ ...d, dataset: d.id }}
                    onToggle={onToggleLayer}
                    onInfoClick={onInfoClick}
                  />
                ))
              ) : (
                <NoContent
                  className="no-datasets"
                  message="No datasets available"
                />
              )}
            </MenuBlock>
          ))
          : datasets.map(d => (
            <LayerToggle
              key={d.id}
              className="dataset-toggle"
              data={{ ...d, dataset: d.id }}
              onToggle={onToggleLayer}
              onInfoClick={onInfoClick}
            />
          ))}
      </div>
    );
  }
}

Datasets.propTypes = {
  name: PropTypes.string,
  datasets: PropTypes.array,
  onToggleLayer: PropTypes.func,
  onInfoClick: PropTypes.func,
  subCategories: PropTypes.array,
  selectedCountries: PropTypes.array,
  countries: PropTypes.array,
  setMenuSettings: PropTypes.func,
  countriesWithoutData: PropTypes.array
};

export default Datasets;
