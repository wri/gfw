import { combineReducers } from 'redux'
import { handleActions } from '../../utils/redux';

import initialState from './initial-state';
import allActions from './actions';
import { reducers as rootReducers } from './components/root/root';
import { reducers as mapReducers } from './components/map/map';
import { reducers as headerReducers } from './components/header/header';
import { reducers as widgetTreeCoverReducers } from './components/widget-tree-cover/widget-tree-cover';
import { reducers as widgetTreeLocatedReducers } from './components/widget-tree-located/widget-tree-located';
import { reducers as widgetTreeLossReducers } from './components/widget-tree-loss/widget-tree-loss';
import { reducers as widgetTreeCoverLossAreasReducers } from './components/widget-tree-cover-loss-areas/widget-tree-cover-loss-areas';
import { reducers as widgetAreasMostCoverGainReducers } from './components/widget-areas-most-cover-gain/widget-areas-most-cover-gain';
import { reducers as widgetTotalAreaPlantationsReducers } from './components/widget-total-area-plantations/widget-total-area-plantations';
import { reducers as widgetTreeCoverGainReducers } from './components/widget-tree-cover-gain/widget-tree-cover-gain';
import { reducers as widgetPlantationAreaReducers } from './components/widget-plantation-area/widget-plantation-area';
import { reducers as widgetStoriesReducers } from './components/widget-stories/widget-stories';

const reducers = combineReducers({
  root: handleActions('root', allActions, rootReducers, initialState),
  map: handleActions('map', allActions, mapReducers, initialState),
  header: handleActions('header', allActions, headerReducers , initialState),
  widgetTreeCover: handleActions('widgetTreeCover', allActions, widgetTreeCoverReducers, initialState),
  widgetTreeLocated: handleActions('widgetTreeLocated', allActions, widgetTreeLocatedReducers, initialState),
  widgetTreeLoss: handleActions('widgetTreeLoss', allActions, widgetTreeLossReducers, initialState),
  widgetTreeCoverLossAreas: handleActions('widgetTreeCoverLossAreas', allActions, widgetTreeCoverLossAreasReducers, initialState),
  widgetAreasMostCoverGain: handleActions('widgetAreasMostCoverGain', allActions, widgetAreasMostCoverGainReducers, initialState),
  widgetTotalAreaPlantations: handleActions('widgetTotalAreaPlantations', allActions, widgetTotalAreaPlantationsReducers, initialState),
  widgetTreeCoverGain: handleActions('widgetTreeCoverGain', allActions, widgetTreeCoverGainReducers, initialState),
  widgetPlantationArea: handleActions('widgetPlantationArea', allActions, widgetPlantationAreaReducers , initialState),
  widgetStories: handleActions('widgetStories', allActions, widgetStoriesReducers , initialState),
});

export default reducers
