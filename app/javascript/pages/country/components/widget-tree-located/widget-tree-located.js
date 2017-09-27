import { createElement } from 'react';
import { connect } from 'react-redux';

import WidgetTreeLocatedComponent from './widget-tree-located-component';
import actions from './widget-tree-located-actions';

export { initialState } from './widget-tree-located-reducers';
export { default as reducers } from './widget-tree-located-reducers';
export { default as actions } from './widget-tree-located-actions';

const mapStateToProps = state => ({
  isLoading: state.widgetTreeLocated.isLoading,
  iso: state.root.iso,
  countryRegion: state.root.countryRegion,
  countryData: state.root.countryData,
  topRegions: state.widgetTreeLocated.topRegions
});

const WidgetTreeLocatedContainer = (props) => {
  const setInitialData = (props) => {
    props.setTreeLocatedValues([
      {
        name: 'Minas Gerais',
        value: 1200000,
        percent: 10
      },
      {
        name: 'Bahia',
        value: 1100000,
        percent: 8
      },
      {
        name: 'Amazonas',
        value: 900000,
        percent: 8
      },
      {
        name: 'Maranhao',
        value: 550000,
        percent: 5
      },
      {
        name: 'Distrito Federal',
        value: 464000,
        percent: 5
      },
      {
        name: 'Ceará',
        value: 460000,
        percent: 5
      },
      {
        name: 'Espírito Santo',
        value: 440000,
        percent: 5
      },
      {
        name: 'Goiás',
        value: 420000,
        percent: 5
      },
      {
        name: 'Maranhao',
        value: 300000,
        percent: 5
      },
      {
        name: 'Mato Grosso',
        value: 203000,
        percent: 5
      }
    ]);
  };
  return createElement(WidgetTreeLocatedComponent, {
    ...props,
    setInitialData
  });
};

export default connect(mapStateToProps, actions)(WidgetTreeLocatedContainer);
