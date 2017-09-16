import { actions as rootActions } from './components/root/root';
import { actions as mapActions } from './components/map/map';

export default {
  ...rootActions,
  ...mapActions
};
