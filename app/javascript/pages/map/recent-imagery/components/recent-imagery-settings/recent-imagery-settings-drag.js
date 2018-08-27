import { DragSource } from 'react-dnd';

const dragSource = {
  beginDrag(props) {
    const { settings: { styles } } = props;
    return styles;
  }
};

export default DragSource('box', dragSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}));
