import { createThunkAction } from 'utils/redux';
import { actions as treeLossActions } from 'pages/country/widget/widgets/widget-tree-loss';

const actions = { ...treeLossActions };

const setWidgetConfigUrl = createThunkAction(
  'setWidgetConfigUrl',
  ({ value, widget }) => (dispatch, getState) => {
    const { location } = getState();
    let params = value;
    if (location.query && location.query[widget]) {
      params = {
        ...location.query[widget],
        ...value
      };
    }
    dispatch({
      type: 'location/COUNTRY',
      payload: location.payload,
      query: { [widget]: JSON.stringify(params) }
    });
  }
);


const setWidgetConfigStore = createThunkAction(
  'setWidgetConfigStore',
  (query) => (dispatch) => {
    Object.keys(query).forEach((widgetKey) => {
      const actionFunc = actions[`set${widgetKey}Settings`];
      if (actionFunc) {
        dispatch(actionFunc(JSON.parse(query[widgetKey])));
      }
    });
  }
);


export default {
  setWidgetConfigUrl,
  setWidgetConfigStore
};
