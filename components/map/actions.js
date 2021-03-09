import { createAction } from 'redux/actions';

export const setMapLoading = createAction('setMapLoading');
export const setMapSettings = createAction('setMapSettings');
export const setMapInteractions = createAction('setMapInteractions');
export const setMapInteractionSelected = createAction(
  'setMapInteractionSelected'
);

export const syncBrushSettings = createAction('syncBrushSettings');
export const clearMapInteractions = createAction('clearMapInteractions');
