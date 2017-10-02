import { actions as rootActions } from './components/root/root';
import { actions as mapActions } from './components/map/map';
import { actions as headerActions } from './components/header/header';
import { actions as widgetTreeCoverActions } from './components/widget-tree-cover/widget-tree-cover';
import { actions as widgetTreeLocatedActions } from './components/widget-tree-located/widget-tree-located';
import { actions as widgetTreeLossActions } from './components/widget-tree-loss/widget-tree-loss';
import { actions as widgetTreeCoverLossAreasActions } from './components/widget-tree-cover-loss-areas/widget-tree-cover-loss-areas';
import { actions as widgetAreasMostCoverGainActions } from './components/widget-areas-most-cover-gain/widget-areas-most-cover-gain';
import { actions as widgetTotalAreaPlantationsActions } from './components/widget-total-area-plantations/widget-total-area-plantations';
import { actions as widgetTreeCoverGainActions } from './components/widget-tree-cover-gain/widget-tree-cover-gain';
import { actions as widgetPlantationAreaActions } from './components/widget-plantation-area/widget-plantation-area';
import { actions as widgetStoriesActions } from './components/widget-stories/widget-stories';

export default {
  ...rootActions,
  ...mapActions,
  ...headerActions,
  ...widgetTreeCoverActions,
  ...widgetTreeLocatedActions,
  ...widgetTreeLossActions,
  ...widgetTreeCoverLossAreasActions,
  ...widgetAreasMostCoverGainActions,
  ...widgetTotalAreaPlantationsActions,
  ...widgetTreeCoverGainActions,
  ...widgetPlantationAreaActions,
  ...widgetStoriesActions
};
