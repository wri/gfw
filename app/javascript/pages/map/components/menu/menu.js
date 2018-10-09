import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import remove from 'lodash/remove';
import debounce from 'lodash/debounce';

import * as modalActions from 'components/modals/meta/meta-actions';
import * as mapActions from 'components/map-v2/actions';

import * as ownActions from './menu-actions';
import reducers, { initialState } from './menu-reducers';
import { getMenuProps } from './menu-selectors';
import MenuComponent from './menu-component';

const actions = {
  ...modalActions,
  ...mapActions,
  ...ownActions
};

class MenuContainer extends PureComponent {
  componentDidMount() {
    const { search } = this.props;
    if (search) {
      this.handleGetLocations(search);
    }
  }

  componentDidUpdate(prevProps) {
    const { search } = this.props;
    if (search && search !== prevProps.search) {
      this.handleGetLocations(search);
    }
  }

  handleGetLocations = debounce(
    search => this.props.getLocationFromSearch(search),
    300
  );

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
  setMapSettings: PropTypes.func,
  getLocationFromSearch: PropTypes.func,
  search: PropTypes.string
};

export const reduxModule = { actions: ownActions, reducers, initialState };

export default connect(getMenuProps, actions)(MenuContainer);
