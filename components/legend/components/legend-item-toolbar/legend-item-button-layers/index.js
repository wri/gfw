import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';

import Tooltip from 'components/tooltip';
import Icon from 'components/ui/icon';

import LegendLayersTooltip from './legend-item-button-layers-tooltip';

class LegendItemButtonLayers extends PureComponent {
  static propTypes = {
    layers: PropTypes.array,
    activeLayer: PropTypes.object,
    icon: PropTypes.string,
    focusStyle: PropTypes.object,
    defaultStyle: PropTypes.object,
    tooltipText: PropTypes.string,
    tooltipOpened: PropTypes.bool,
    scrolling: PropTypes.bool,
    i: PropTypes.number,
    onChangeLayer: PropTypes.func,
    onTooltipVisibilityChange: PropTypes.func,
  };

  static defaultProps = {
    layers: [],
    activeLayer: {},
    icon: '',
    focusStyle: {},
    defaultStyle: {},
    tooltipOpened: false,
    tooltipText: null,
    scrolling: false,

    onChangeLayer: () => {},
    onTooltipVisibilityChange: () => {},
  };

  state = {
    visibilityHover: false,
    visibilityClick: false,
    multiLayersActive: this.props.i === 0 && this.props.layers.length > 1,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { scrolling, i: prevIndex } = this.props;
    const { i: nextIndex } = nextProps;

    if (scrolling || prevIndex !== nextIndex) {
      this.onTooltipVisibilityChange(false);
    }
  }

  onTooltipVisibilityChange = (visibility) => {
    const { onTooltipVisibilityChange } = this.props;
    const { multiLayersActive } = this.state;

    this.setState({
      visibilityHover: false,
      visibilityClick: visibility,
      ...(multiLayersActive && {
        multiLayersActive: false,
      }),
    });

    onTooltipVisibilityChange(visibility);
  };

  /**
   * HELPERS
   * - getTimelineLayers
   */
  getTimelineLayers = () => {
    const { layers } = this.props;

    return sortBy(
      layers.filter((l) => l.layerConfig.timeline),
      (l) => l.layerConfig.order
    );
  };

  render() {
    const {
      layers,
      activeLayer,
      icon,
      focusStyle,
      defaultStyle,
      tooltipText,
      onChangeLayer,
      tooltipOpened,
    } = this.props;
    const { visibilityClick, visibilityHover, multiLayersActive } = this.state;
    const timelineLayers = this.getTimelineLayers();

    if (layers.length === 1 || timelineLayers.length) {
      return null;
    }

    return (
      <Tooltip
        overlay={(
          <LegendLayersTooltip
            layers={layers}
            activeLayer={activeLayer}
            onChangeLayer={onChangeLayer}
          />
        )}
        overlayClassName="c-rc-tooltip -default -layers"
        placement="top"
        trigger={['click']}
        visible={visibilityClick}
        onVisibleChange={this.onTooltipVisibilityChange}
        destroyTooltipOnHide
      >
        <Tooltip
          visible={multiLayersActive || (!visibilityClick && visibilityHover)}
          overlay={tooltipText || `${layers.length} layers`}
          overlayClassName="c-rc-tooltip -default"
          placement="top"
          trigger={tooltipOpened ? '' : 'hover'}
          onVisibleChange={(visibility) =>
            this.setState({
              visibilityHover: visibility,
              multiLayersActive: false,
            })}
          destroyTooltipOnHide
        >
          <button
            type="button"
            className="c-legend-button layers"
            aria-label="Select other layer"
          >
            <Icon
              icon={icon || 'icon-layers'}
              className="c-icon-small"
              style={
                visibilityHover || visibilityClick ? focusStyle : defaultStyle
              }
            />
          </button>
        </Tooltip>
      </Tooltip>
    );
  }
}

export default LegendItemButtonLayers;
