import { createAction, createThunkAction } from 'utils/redux';
import { track } from 'app/analytics';

import { getNonGlobalDatasets } from 'services/analysis-cached';
import { setDashboardPromptsSettings } from 'components/prompts/dashboard-prompts/actions';

// widgets
export const setWidgetsData = createAction('setWidgetsData');
export const setWidgetSettingsByKey = createAction('setWidgetSettingsByKey');
export const setWidgetsSettings = createAction('setWidgetsSettings');
export const setActiveWidget = createAction('setActiveWidget');
export const setShowMap = createAction('setShowMap');
export const setWidgetsLoading = createAction('setWidgetsLoading');

export const getWidgetsData = createThunkAction(
  'getWidgetsData',
  () => (dispatch) => {
    dispatch(setWidgetsLoading({ loading: true, error: false }));
    getNonGlobalDatasets()
      .then((response) => {
        const { rows } = response.data;
        dispatch(
          setWidgetsData({
            nonGlobalDatasets: rows && rows[0],
          })
        );
      })
      .catch(() => {
        dispatch(setWidgetsLoading({ error: true, loading: false }));
      });
  }
);

export const setWidgetSettings = createThunkAction(
  'setWidgetSettings',
  ({ change, widget }) => (dispatch) => {
    dispatch(
      setWidgetSettingsByKey({
        key: widget,
        change,
      })
    );
    track('changeWidgetSettings', {
      label: `${widget}`,
    });
    if (!change.interaction) {
      dispatch(
        setDashboardPromptsSettings({
          open: true,
          stepIndex: 0,
          stepsKey: 'shareWidget',
        })
      );
    }
  }
);
