import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import NoContent from 'components/ui/no-content';

import LayerToggle from 'components/map/components/legend/components/layer-toggle';
import MenuBlock from 'pages/map/menu/components/menu-block';

import './styles.scss';

class Datasets extends PureComponent {
  render() {
    const { datasets, subCategories, onToggleLayer, onInfoClick } = this.props;

    return (
      <div className="c-datasets">
        {subCategories
          ? subCategories.map(subCat => (
            <MenuBlock key={subCat.slug} {...subCat}>
              {!isEmpty(subCat.datasets) ? (
                subCat.datasets.map(d => (
                  <LayerToggle
                    key={d.id}
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
  subCategories: PropTypes.array
};

export default Datasets;
