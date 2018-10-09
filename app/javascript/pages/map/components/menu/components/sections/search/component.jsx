import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import Search from 'components/ui/search';
import NoContent from 'components/ui/no-content';
import LayerToggle from 'components/map-v2/components/legend/components/layer-toggle';

import './styles.scss';

class MapMenuSearch extends PureComponent {
  handleSearchChange = () => {};

  render() {
    const {
      datasets,
      onToggleLayer,
      onInfoClick,
      search,
      setMenuSettings
    } = this.props;

    return (
      <div className="c-map-menu-search">
        <h3>Search</h3>
        <Search
          className="side-menu-search"
          placeholder="Search"
          input={search}
          onChange={value => setMenuSettings({ search: value })}
        />
        {!search && (
          <NoContent
            className="empty-search"
            message="Enter a search to find datasets or locations..."
          />
        )}
        {search && (
          <Fragment>
            {datasets && !!datasets.length ? (
              <div className="datasets-search">
                {datasets.map(d => (
                  <LayerToggle
                    key={d.id}
                    className="dataset-toggle"
                    data={{ ...d, dataset: d.id }}
                    onToggle={onToggleLayer}
                    onInfoClick={onInfoClick}
                    showSubtitle
                  />
                ))}
              </div>
            ) : (
              <NoContent
                className="empty-search"
                message={`No datasets found for '${search}'`}
              />
            )}
          </Fragment>
        )}
      </div>
    );
  }
}

MapMenuSearch.propTypes = {
  datasets: PropTypes.array,
  onToggleLayer: PropTypes.func,
  onInfoClick: PropTypes.func,
  search: PropTypes.string,
  setMenuSettings: PropTypes.func
};

export default MapMenuSearch;
