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
  onToggleLayer = (data, value) => {
    const { layers, setMapSettings } = this.props;
    const { dataset, layer } = data;
    let newLayers = [...layers];
    if (!value) {
      newLayers = remove(newLayers, l => l.dataset !== dataset);
    } else {
      newLayers = [
        {
          dataset,
          opacity: 1,
          visibility: true,
          layers: [layer]
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
