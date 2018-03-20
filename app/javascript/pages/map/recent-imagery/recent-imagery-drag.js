import { DropTarget } from 'react-dnd';

const dropTarget = {
  drop(props, monitor) {
    const { setRecentImagerySettings } = props;
    const item = monitor.getItem();
    const delta = monitor.getDifferenceFromInitialOffset();
    const top = Math.round(item.top + delta.y);
    const left = `calc(${item.left} + ${Math.round(delta.x)}px)`;
    setRecentImagerySettings({ styles: { top, left } });
  }
};

export default DropTarget('box', dropTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  canDrop: monitor.canDrop()
}));
