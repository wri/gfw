import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import Icon from 'components/icon';
import './styles.scss';

const LegendItemDrag = () => (
  <span className="c-legend-handler">
    <Icon name="icon-drag-dots" className="-small" />
  </span>
);

export default SortableHandle(LegendItemDrag);
