import { connect } from 'react-redux';

import withTooltipEvent from 'components/ui/with-tooltip-evt';

import mapActions from 'components/map-v2/actions';
import { getRecentImageryProps } from 'components/map-v2/components/recent-imagery/recent-imagery-selectors';
import recentImageryActions from 'components/map-v2/components/recent-imagery/recent-imagery-actions';

import Component from './recent-imagery-settings-component';

const actions = { ...mapActions, ...recentImageryActions };

export default withTooltipEvent(
  connect(getRecentImageryProps, actions)(Component)
);
