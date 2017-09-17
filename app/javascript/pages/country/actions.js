import { actions as rootActions } from './components/root/root';
import { actions as mapActions } from './components/map/map';
import { actions as widgetTreeCoverActions } from './components/widget-tree-cover/widget-tree-cover';

export default {
  ...rootActions,
  ...mapActions,
  ...widgetTreeCoverActions
};
