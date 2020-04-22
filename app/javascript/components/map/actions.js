import { createAction } from 'utils/redux';

export const setMapLoading = createAction('setMapLoading');
export const setMapSettings = createAction('setMapSettings');
export const setMapInteractions = createAction('setMapInteractions');
export const setMapInteractionSelected = createAction(
  'setMapInteractionSelected'
);
export const clearMapInteractions = createAction('clearMapInteractions');
