import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import remove from 'lodash/remove';

import NoContent from 'components/ui/no-content';

import LayerToggle from 'components/map/components/legend/components/layer-toggle';
import MenuBlock from 'pages/map/menu/components/menu-block';
import Pill from 'components/ui/pill';
import Dropdown from 'components/ui/dropdown';

import './styles.scss';

class Datasets extends PureComponent {
  render() {
    const {
      datasets,
      subCategories,
      onToggleLayer,
      onInfoClick,
      countries,
      selectedCountries,
      setMenuSettings,
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
                  className={
                    countriesWithoutData.indexOf(c.label) > -1
                      ? '-inactive'
                      : ''
                  }
                  label={c.label}
                  onRemove={() => {
                    const newCountries = remove(
                      selectedCountries,
                      sc => sc.value !== c.value
                    );
                    setMenuSettings({
                      selectedCountries: newCountries
                        ? newCountries.map(nc => nc.value)
                        : []
                    });
                  }}
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
                onChange={e => {
                  setMenuSettings({
                    selectedCountries: [
                      ...selectedCountries.map(c => c.value),
                      e.value
                    ]
                  });
                }}
                searchable
              />
            )}
          </div>
        </div>
        {countriesWithoutData && (
          <p
            className="no-datasets-message"
            dangerouslySetInnerHTML={{
              __html: `No datasets available for <strong>${countriesWithoutData.join(
                '</strong>, <strong>'
              )}</strong> in ${'category'}`
            }}
          />
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
