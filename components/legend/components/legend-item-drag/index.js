import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import Icon from 'components/ui/icon';

import './styles.scss';

const LegendItemDrag = () => (
  <span className="c-legend-handler">
    <Icon icon="icon-drag-dots" className="c-icon-small" />
  </span>
);

export default SortableHandle(LegendItemDrag);
