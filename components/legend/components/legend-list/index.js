import { SortableContainer } from 'react-sortable-hoc';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

class LegendList extends PureComponent {
  static propTypes = {
    sortable: PropTypes.bool,
    children: PropTypes.node
  }

  static defaultProps = {
    sortable: true,
    children: []
  }

  constructor(props) {
    super(props);
    this.state = {
      scrolling: false
    };

    this.timeout = null;
  }

  onScroll = (e) => {
    if (e.target.id !== 'vizzuality-legend-list') {
      return false;
    }

    const { scrolling } = this.state;
    if (this.timeout) {
      // if there is already a timeout in process cancel it
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.setState({
        scrolling: false
      });
    }, 250);

    if (!scrolling) {
      this.setState({
        scrolling: true
      });
    }

  }

  render() {
    const { sortable, children } = this.props;
    const { scrolling } = this.state;

    return (
      <ul id="vizzuality-legend-list" className="c-legend-list" onScroll={this.onScroll}>
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child, {
            sortable,
            index,
            i: index,
            scrolling
          }))}
      </ul>
    );
  }
}

export default SortableContainer(LegendList);
