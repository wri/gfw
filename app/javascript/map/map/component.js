import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';

import 'react-tippy/dist/tippy.css';
import 'styles/styles.scss';

import RecentImagery from './recent-imagery';

import './styles.scss';

class Root extends PureComponent {
  render() {
    const { loading } = this.props;

    if (loading) {
      return null;
    }

    return (
      <div className="l-map">
        <DragDropContextProvider backend={HTML5Backend}>
          <RecentImagery />
        </DragDropContextProvider>
      </div>
    );
  }
}

Root.propTypes = {
  loading: PropTypes.bool.isRequired
};

export default Root;
