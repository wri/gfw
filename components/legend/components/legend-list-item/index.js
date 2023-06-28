import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { SortableElement } from 'react-sortable-hoc';

// Components
import LegendItemDrag from '../legend-item-drag';

import './styles.scss';

class LegendListItem extends PureComponent {
  static propTypes = {
    dataset: PropTypes.string,
    layers: PropTypes.arrayOf(PropTypes.shape({})),
    sortable: PropTypes.bool,
    children: PropTypes.node,
    toolbar: PropTypes.node,
    title: PropTypes.node
  }

  static defaultProps = {
    dataset: '',
    layers: [],
    sortable: true,
    children: [],
    toolbar: [],
    title: []
  }

  render() {
    const { layers, sortable, children, toolbar, title, ...props } = this.props;
    const activeLayer = layers.find(l => l.active) || layers[0];

    return (
      <li
        styleName={classnames({
          'c-legend-item': true,
          '-sortable': sortable
        })}
      >
        <div
          styleName={classnames({
            'legend-item-container': true,
            '-sortable': sortable
          })}
        >
          {sortable &&
            <LegendItemDrag />
          }

          <div styleName="legend-info">
            <header styleName="legend-item-header">
              <h3>
                {React.isValidElement(title) && typeof title.type !== 'string' ?
                  React.cloneElement(title, { ...props, layers, activeLayer }) :
                  (activeLayer && activeLayer.name)
                }
              </h3>
              {React.isValidElement(toolbar) && typeof toolbar.type !== 'string' &&
                React.cloneElement(toolbar, { ...props, layers, activeLayer })
              }
            </header>

            {React.Children.map(children, child => (React.isValidElement(child) && typeof child.type !== 'string' ?
              React.cloneElement(child, { layers, activeLayer })
              :
              child
            ))}

          </div>
        </div>
      </li>
    );
  }
}

export default SortableElement(({ layerGroup, ...props }) =>
  <LegendListItem key={props.dataset} {...layerGroup} {...props} />);
