import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { LegendItemTypes } from 'vizzuality-components/dist/legend';
import LayerToggle from '../layer-toggle';
import LayerMoreInfo from '../layer-more-info';

import './styles.scss';

class LayerListMenu extends PureComponent {
  filterLayerListMenu() {
    const { layers } = this.props;
    const activeLayer = layers && layers.find((l) => l.active);

    return layers
      .filter((l) => !l.default && !l.isSelector)
      .filter((l) => {
        if (l.id.includes('geographic-coverage')) {
          if (
            activeLayer.id === 'integrated-deforestation-alerts-8bit' ||
            activeLayer.id === 'integrated-deforestation-alerts-8bit-gladL'
          ) {
            return l.id === 'glad-deforestation-alerts-geographic-coverage';
          }

          if (activeLayer.id === 'integrated-deforestation-alerts-8bit-radd') {
            return l.id === 'radd-deforestation-alerts-geographic-coverage';
          }

          if (activeLayer.id === 'integrated-deforestation-alerts-8bit-gladS') {
            return (
              l.id === 'glad-plus-deforestation-alerts-geographic-coverage'
            );
          }
        }
        return true;
      });
  }

  render() {
    const { className, layers, onToggle, onInfoClick } = this.props;
    const activeLayer = layers && layers.find((l) => l.active);
    const filteredLayers = this.filterLayerListMenu();
    return (
      <div className={`c-layer-list-menu ${className || ''}`}>
        {filteredLayers.map((l, i) => (
          <div className="layer-toggle" key={l.id}>
            <LayerToggle
              tabIndex={i}
              data={{
                ...l,
                layer: l.id,
                ...(l.id === 'confirmedOnly' &&
                  activeLayer?.highConfInfo && {
                    description: activeLayer.highConfInfo,
                  }),
              }}
              onToggle={onToggle}
              onInfoClick={() => onInfoClick(l.metadata)}
              small
            />
            {l.nestedLegend && l.active && (
              <div className="nested-legend">
                <LegendItemTypes activeLayer={l} />
              </div>
            )}
            {l.legendDesc && (
              <p className="layer-description">{l.legendDesc}</p>
            )}
            {l.moreInfo && (
              <LayerMoreInfo className="more-info" {...l.moreInfo} />
            )}
          </div>
        ))}
      </div>
    );
  }
}

LayerListMenu.propTypes = {
  className: PropTypes.string,
  layers: PropTypes.array,
  onToggle: PropTypes.func,
  onInfoClick: PropTypes.func,
};

export default LayerListMenu;
