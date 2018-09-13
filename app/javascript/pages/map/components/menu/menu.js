import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import remove from 'lodash/remove';

import * as modalActions from 'components/modals/meta/meta-actions';
import * as mapActions from 'components/map-v2/actions';

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
    const { dataset, layer, iso } = data;
    let newActiveDatasets = [...activeDatasets];
    if (!value) {
      newActiveDatasets = remove(newActiveDatasets, l => l.dataset !== dataset);
    } else {
      newActiveDatasets = [
        {
          dataset,
          opacity: 1,
          visibility: true,
          layers: [layer],
          ...(iso &&
            iso.length === 1 && {
              iso: iso[0]
            })
        }
      ].concat([...newActiveDatasets]);
    }
    setMapSettings({
      datasets: newActiveDatasets || [],
      ...(value && { canBound: true })
    });
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

export default connect(getMenuProps, actions)(MenuContainer);
