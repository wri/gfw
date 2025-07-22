import { createAction, createThunkAction } from 'redux/actions';
import { trackEvent } from 'utils/analytics';

import { setDashboardPromptsSettings } from 'components/prompts/dashboard-prompts/actions';

// widgets
export const setWidgetsData = createAction('setWidgetsData');
export const setWidgetsChartSettings = createAction('setWidgetsChartSettings');
export const setWidgetsCategory = createAction('setWidgetsCategory');
export const setWidgetSettingsByKey = createAction('setWidgetSettingsByKey');
export const setWidgetInteractionByKey = createAction(
  'setWidgetInteractionByKey'
);
export const setWidgetsSettings = createAction('setWidgetsSettings');
export const setActiveWidget = createAction('setActiveWidget');
export const setShowMap = createAction('setShowMap');
export const setWidgetsLoading = createAction('setWidgetsLoading');

export const setWidgetSettings = createThunkAction(
  'setWidgetSettings',
  ({ change, widget }) =>
    (dispatch) => {
      dispatch(
        setWidgetSettingsByKey({
          key: widget,
          change,
        })
      );
      if (!change.interaction) {
        trackEvent({
          category: 'Widget Settings',
          action: 'User changes the widget settings',
          label: widget,
        });
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
