import { actions as rootActions } from './components/root/root';
import { actions as mapActions } from './components/map/map';
import { actions as widgetTreeCoverActions } from './components/widget-tree-cover/widget-tree-cover';
import { actions as widgetTreeLocatedActions } from './components/widget-tree-located/widget-tree-located';
import { actions as widgetTreeCoverLossActions } from './components/widget-tree-cover-loss/widget-tree-cover-loss';

export default {
  ...rootActions,
  ...mapActions,
  ...widgetTreeCoverActions,
  ...widgetTreeLocatedActions,
  ...widgetTreeCoverLossActions
};
