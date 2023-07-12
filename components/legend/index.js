import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { arrayMoveImmutable } from 'utils/array-move';

import Icon from 'components/ui/icon';

import LegendList from './components/legend-list';

import './styles.scss';

class Legend extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    sortable: PropTypes.bool,
    maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    expanded: PropTypes.bool,
    collapsable: PropTypes.bool,
    onChangeOrder: PropTypes.func,
    children: PropTypes.node,
  };

  static defaultProps = {
    title: 'Legend',
    sortable: true,
    expanded: true,
    collapsable: true,
    maxWidth: null,
    maxHeight: null,
    children: [],
    onChangeOrder: (ids) => console.info(ids),
  };

  constructor(props) {
    super(props);
    const { expanded } = props;
    this.state = { expanded };
  }

  /**
   * UI EVENTS
   * onToggleLegend
   * onSortEnd
   */
  onToggleLegend = (bool) => {
    this.setState({ expanded: bool });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { onChangeOrder, children } = this.props;
    const layers = [...children.map((c) => c.props.layerGroup.dataset)];
    const layersDatasets = arrayMoveImmutable(layers, oldIndex, newIndex);

    onChangeOrder(layersDatasets);
  };

  render() {
    const {
      title,
      sortable,
      collapsable,
      maxWidth,
      maxHeight,
      children,
    } = this.props;

    const { expanded } = this.state;

    if (!children || !React.Children.count(children)) {
      return null;
    }

    return (
      <div className="c-legend-map" style={{ maxWidth }}>
        {/* LEGEND OPENED */}
        <div
          className={`open-legend ${classnames({ '-active': expanded })}`}
          style={{ maxHeight }}
        >
          {/* Toggle button */}
          {collapsable && (
            <button
              type="button"
              className="toggle-legend"
              onClick={() => this.onToggleLegend(false)}
            >
              <Icon icon="icon-arrow-down" className="-small" />
            </button>
          )}

          {expanded && (
            <LegendList
              helperClass="c-legend-item -sortable"
              onSortStart={
                (_, event) => event.preventDefault() // It fixes user select in Safari and IE
              }
              onSortEnd={this.onSortEnd}
              axis="y"
              lockAxis="y"
              lockToContainerEdges
              lockOffset="50%"
              useDragHandle
              sortable={sortable}
            >
              {React.Children.map(children, (child, index) =>
                React.isValidElement(child) && child.type === 'LegendItemList'
                  ? React.cloneElement(child, { sortable, index })
                  : child
              )}
            </LegendList>
          )}
        </div>

        {/* LEGEND CLOSED */}
        <button
          type="button"
          className={`close-legend ${classnames({ '-active': !expanded })}`}
          onClick={() => this.onToggleLegend(true)}
        >
          <h1 className="legend-title">
            {title}

            {/* Toggle button */}
            <div className="toggle-legend">
              <Icon icon="icon-arrow-up" className="-small" />
            </div>
          </h1>
        </button>
      </div>
    );
  }
}

export default Legend;
export { default as LegendListItem } from './components/legend-list-item';
export {
  default as LegendItemToolbar,
  LegendItemButtonBBox,
  LegendItemButtonLayers,
  LegendItemButtonOpacity,
  LegendItemButtonVisibility,
  LegendItemButtonInfo,
  LegendItemButtonRemove,
} from './components/legend-item-toolbar';
