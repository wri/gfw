import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import remove from 'lodash/remove';

import modalActions from 'components/modals/meta/meta-actions';
import mapActions from 'components/map/map-actions';
import ownActions from './menu-actions';

import reducers, { initialState } from './menu-reducers';
import { getMenuProps } from './menu-selectors';

import MenuComponent from './menu-component';

const actions = {
  ...modalActions,
  ...mapActions,
  ...ownActions
};

const mapStateToProps = ({ mapMenu, datasets, location }) => ({
  ...getMenuProps({
    ...datasets,
    ...location,
    ...mapMenu
  })
});

class MenuContainer extends PureComponent {
  onToggleLayer = (layer, value) => {
    const { layers, setMapSettings } = this.props;
    const { id, layerId } = layer;
    let newLayers = [...layers];
    if (!value) {
      newLayers = remove(newLayers, l => l.dataset !== id);
    } else {
      newLayers = [
        {
          dataset: id,
          opacity: 1,
          visibility: true,
          layer: layerId
        }
      ].concat([...newLayers]);
    }
    setMapSettings({ layers: newLayers || [] });
  };

  render() {
    return createElement(MenuComponent, {
      ...this.props,
      onToggleLayer: this.onToggleLayer
    });
  }
}

MenuContainer.propTypes = {
  layers: PropTypes.array,
  setMapSettings: PropTypes.func
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(MenuContainer);
