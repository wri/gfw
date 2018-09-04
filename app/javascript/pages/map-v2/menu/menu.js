import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import remove from 'lodash/remove';

import modalActions from 'components/modals/meta/meta-actions';
import mapActions from 'components/map-v2/actions';

import * as ownActions from './menu-actions';
import { getMenuProps } from './menu-selectors';
import MenuComponent from './menu-component';

const actions = {
  ...modalActions,
  ...mapActions,
  ...ownActions
};

class MenuContainer extends PureComponent {
  onToggleLayer = (data, value) => {
    const { activeDatasets, setMapSettings } = this.props;
    const { dataset, layer } = data;
    let newActiveDatasets = [...activeDatasets];
    if (!value) {
      newActiveDatasets = remove(newActiveDatasets, l => l.dataset !== dataset);
    } else {
      newActiveDatasets = [
        {
          dataset,
          opacity: 1,
          visibility: true,
          layers: [layer]
        }
      ].concat([...newActiveDatasets]);
    }
    setMapSettings({ datasets: newActiveDatasets || [] });
  };

  render() {
    return createElement(MenuComponent, {
      ...this.props,
      onToggleLayer: this.onToggleLayer
    });
  }
}

MenuContainer.propTypes = {
  activeDatasets: PropTypes.array,
  setMapSettings: PropTypes.func
};

export { actions };

export default connect(getMenuProps, actions)(MenuContainer);
