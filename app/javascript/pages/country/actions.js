import { actions as rootActions } from './components/root/root';
import { actions as mapActions } from './components/map/map';
import { actions as widgetTreeCoverActions } from './components/widget-tree-cover/widget-tree-cover';
import { actions as widgetTreeLocatedActions } from './components/widget-tree-located/widget-tree-located';
import { actions as widgetTreeLossActions } from './components/widget-tree-loss/widget-tree-loss';
import { actions as widgetTreeCoverLossAreasActions } from './components/widget-tree-cover-loss-areas/widget-tree-cover-loss-areas';

export default {
  ...rootActions,
  ...mapActions,
  ...widgetTreeCoverActions,
  ...widgetTreeLocatedActions,
  ...widgetTreeLossActions,
  ...widgetTreeCoverLossAreasActions
};
