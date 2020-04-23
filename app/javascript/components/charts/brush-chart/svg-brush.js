/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class SVGBrush extends PureComponent {
  static defaultProps = {
    extent: [[0, 0], [1, 1]],
    onBrushStart: event => {},
    onBrush: event => {},
    onBrushEnd: event => {},
    getEventMouse: event => [event.clientX, event.clientY],
    brushType: '2d' // 'x', 'y'
  };

  static propTypes = {
    selection: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    extent: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    onBrushStart: PropTypes.func.isRequired,
    onBrush: PropTypes.func.isRequired,
    onBrushEnd: PropTypes.func.isRequired,
    getEventMouse: PropTypes.func.isRequired,
    brushType: PropTypes.string.isRequired
  };

  static getDerivedStateFromProps = (props, state) => ({
    ...state,
    selection: props.selection === undefined ? state.selection : props.selection
  });

  constructor(props) {
    super(props);
    this.state = {
      selection: null
    };
    this.move = null;
  }

  _handleBrushStart = event => {
    event.target.setPointerCapture(event.pointerId);
    this.move = this.props.getEventMouse(event);
    this.props.onBrushStart({
      target: this,
      type: 'start',
      selection: this.state.selection,
      sourceEvent: event
    });
  };

  _handleBrushEnd = event => {
    this.move = null;
    this.props.onBrushEnd({
      target: this,
      type: 'end',
      selection: this.state.selection,
      sourceEvent: event
    });
  };

  _renderOverlay() {
    const { extent: [[x0, y0], [x1, y1]], brushType } = this.props;

    return (
      <rect
        className="overlay"
        pointerEvents="all"
        // cursor="crosshair"
        fill="none"
        x={x0}
        y={y0}
        width={x1 - x0}
        height={y1 - y0}
        // onPointerDown={this._handleBrushStart}
        // onPointerMove={event => {
        //   if (this.move) {
        //     const [x, y] = this.props.getEventMouse(event);
        //     const [sx, sy] = this.move;
        //     let selection = this.state.selection;
        //     switch (brushType) {
        //       case '2d':
        //         selection = [
        //           [
        //             Math.max(Math.min(sx, x), x0),
        //             Math.max(Math.min(sy, y), y0)
        //           ],
        //           [Math.min(Math.max(sx, x), x1), Math.min(Math.max(sy, y), y1)]
        //         ];
        //         break;
        //       case 'x':
        //         selection = [
        //           [Math.min(sx, x), y0],
        //           [Math.max(sx, x), y1]
        //         ];
        //         break;
        //       case 'y':
        //         selection = [
        //           [x0, Math.min(sy, y)],
        //           [x1, Math.max(sy, y)]
        //         ];
        //     }
        //     this.setState({ selection });
        //     this.props.onBrush({
        //       target: this,
        //       type: 'brush',
        //       selection,
        //       sourceEvent: event
        //     });
        //   }
        // }}
        // onPointerUp={event => {
        //   const move = this.props.getEventMouse(event);
        //   let selection = this.state.selection;
        //   if (
        //     this.move &&
        //     this.move[0] === move[0] &&
        //     this.move[1] === move[1]
        //   ) {
        //     selection = null;
        //     this.props.onBrush({
        //       target: this,
        //       type: 'brush',
        //       selection,
        //       sourceEvent: event
        //     });
        //   }
        //   this.move = null;
        //   this.setState({ selection });
        //   this.props.onBrushEnd({
        //     target: this,
        //     type: 'end',
        //     selection,
        //     sourceEvent: event
        //   });
        // }}
      />
    );
  }

  _renderSelection() {
    const { extent: [[ex0, ey0], [ex1, ey1]], brushType } = this.props;
    const { selection } = this.state;
    if (!selection) {
      return null;
    }
    const [[x0, y0], [x1, y1]] = selection;
    const [x, y, w, h] = [x0, y0, x1 - x0, y1 - y0];
    const xbf = x => Math.min(Math.max(x, ex0), ex1);
    const ybf = y => Math.min(Math.max(y, ey0), ey1);
    const sxbf = (x0, x1, dx) => {
      if (x0 + dx < ex0) {
        return [ex0, x1 + (ex0 - x0)];
      }
      if (x1 + dx > ex1) {
        return [x0 + (ex1 - x1), ex1];
      }
      return [x0 + dx, x1 + dx];
    };
    const sybf = (y0, y1, dy) => {
      if (y0 + dy < ey0) {
        return [ey0, y1 + (ey0 - y0)];
      }
      if (y1 + dy > ey1) {
        return [y0 + (ey1 - y1), ey1];
      }
      return [y0 + dy, y1 + dy];
    };

    return (
      <React.Fragment>
        <rect
          className="selection"
          cursor="move"
          fill="#777"
          fillOpacity="0.3"
          stroke="#fff"
          shapeRendering="crispEdges"
          x={x}
          y={y}
          width={w}
          height={h}
          onPointerDown={this._handleBrushStart}
          onPointerMove={event => {
            if (this.move) {
              const [x, y] = this.props.getEventMouse(event);
              const [sx, sy] = this.move;
              const [dx, dy] = [x - sx, y - sy];
              const [mx0, mx1] = sxbf(x0, x1, dx);
              const [my0, my1] = sybf(y0, y1, dy);
              let selection = this.state.selection;
              switch (brushType) {
                case '2d':
                  selection = [[mx0, my0], [mx1, my1]];
                  break;
                case 'x':
                  selection = [[mx0, y0], [mx1, y1]];
                  break;
                case 'y':
                  selection = [[x0, my0], [x1, my1]];
              }
              this.move = [x, y];
              this.setState({ selection });
              this.props.onBrush({
                target: this,
                type: 'brush',
                selection,
                sourceEvent: event
              });
            }
          }}
          onPointerUp={this._handleBrushEnd}
        />
        <rect
          ref={input => (this.handleN = input)}
          className="handle handle--n"
          cursor="ns-resize"
          x={x - 5}
          y={y - 5}
          width={w + 10}
          height={10}
          fill="none"
          pointerEvents="visible"
          onPointerDown={this._handleBrushStart}
          onPointerMove={event => {
            if (this.move) {
              const [x, y] = this.props.getEventMouse(event);
              const [sx, sy] = this.move;
              const dy = y - sy;
              const my = ybf(y0 + dy);
              const [my0, my1] = my < y1 ? [my, y1] : [y1, y1];
              let selection = this.state.selection;
              switch (brushType) {
                case '2d':
                case 'y':
                  selection = [[x0, my0], [x1, my1]];
              }
              this.move = [x, y];
              this.setState({ selection });
              this.props.onBrush({
                target: this,
                type: 'brush',
                selection,
                sourceEvent: event
              });
              if (my >= y1) {
                this.handleS.setPointerCapture(event.pointerId);
              }
            }
          }}
          onPointerUp={this._handleBrushEnd}
        />
        <rect
          ref={input => (this.handleE = input)}
          className="handle handle--e"
          cursor="ew-resize"
          x={x + w - 5}
          y={y - 5}
          width={10}
          height={h + 10}
          fill="none"
          pointerEvents="visible"
          onPointerDown={this._handleBrushStart}
          onPointerMove={event => {
            if (this.move) {
              const [x, y] = this.props.getEventMouse(event);
              const [sx, sy] = this.move;
              const dx = x - sx;
              const mx = xbf(x1 + dx);
              const [mx0, mx1] = x0 < mx ? [x0, mx] : [x0, x0];
              let selection = this.state.selection;
              switch (brushType) {
                case '2d':
                case 'x':
                  selection = [[mx0, y0], [mx1, y1]];
              }
              this.move = [x, y];
              this.setState({ selection });
              this.props.onBrush({
                target: this,
                type: 'brush',
                selection,
                sourceEvent: event
              });
              if (x0 >= mx) {
                this.handleW.setPointerCapture(event.pointerId);
              }
            }
          }}
          onPointerUp={this._handleBrushEnd}
        />
        <rect
          ref={input => (this.handleS = input)}
          className="handle handle--s"
          cursor="ns-resize"
          x={x - 5}
          y={y + h - 5}
          width={w + 10}
          height={10}
          fill="none"
          pointerEvents="visible"
          onPointerDown={this._handleBrushStart}
          onPointerMove={event => {
            if (this.move) {
              const [x, y] = this.props.getEventMouse(event);
              const [sx, sy] = this.move;
              const dy = y - sy;
              const my = ybf(y1 + dy);
              const [my0, my1] = y0 < my ? [y0, my] : [y0, y0];
              let selection = this.state.selection;
              switch (brushType) {
                case '2d':
                case 'y':
                  selection = [[x0, my0], [x1, my1]];
              }
              this.move = [x, y];
              this.setState({ selection });
              this.props.onBrush({
                target: this,
                type: 'brush',
                selection,
                sourceEvent: event
              });
              if (y0 >= my) {
                this.handleN.setPointerCapture(event.pointerId);
              }
            }
          }}
          onPointerUp={this._handleBrushEnd}
        />
        <rect
          ref={input => (this.handleW = input)}
          className="handle handle--w"
          cursor="ew-resize"
          x={x - 5}
          y={y - 5}
          width={10}
          height={h + 10}
          fill="none"
          pointerEvents="visible"
          onPointerDown={this._handleBrushStart}
          onPointerMove={event => {
            if (this.move) {
              const [x, y] = this.props.getEventMouse(event);
              const [sx, sy] = this.move;
              const dx = x - sx;
              const mx = xbf(x0 + dx);
              const [mx0, mx1] = mx < x1 ? [mx, x1] : [x1, x1];
              let selection = this.state.selection;
              switch (brushType) {
                case '2d':
                case 'x':
                  selection = [[mx0, y0], [mx1, y1]];
              }
              this.move = [x, y];
              this.setState({ selection });
              this.props.onBrush({
                target: this,
                type: 'brush',
                selection,
                sourceEvent: event
              });
              if (mx >= x1) {
                this.handleE.setPointerCapture(event.pointerId);
              }
            }
          }}
          onPointerUp={this._handleBrushEnd}
        />
        <rect
          ref={input => (this.handleNW = input)}
          className="handle handle--nw"
          cursor="nwse-resize"
          x={x - 5}
          y={y - 5}
          width={10}
          height={10}
          fill="none"
          pointerEvents="visible"
          onPointerDown={this._handleBrushStart}
          onPointerMove={event => {
            if (this.move) {
              const [x, y] = this.props.getEventMouse(event);
              const [sx, sy] = this.move;
              const [dx, dy] = [x - sx, y - sy];
              let [mx, my] = [x0, y0];
              let mx0;
              let mx1;
              let my0;
              let my1;
              let selection = this.state.selection;
              switch (brushType) {
                case '2d':
                  [mx, my] = [xbf(x0 + dx), ybf(y0 + dy)];
                  [mx0, mx1] = mx < x1 ? [mx, x1] : [x1, x1];
                  [my0, my1] = my < y1 ? [my, y1] : [y1, y1];
                  selection = [[mx0, my0], [mx1, my1]];
                  break;
                case 'x':
                  [mx, my] = [xbf(x0 + dx), y0];
                  [mx0, mx1] = mx < x1 ? [mx, x1] : [x1, x1];
                  selection = [[mx0, y0], [mx1, y1]];
                  break;
                case 'y':
                  [mx, my] = [x0, ybf(y0 + dy)];
                  [my0, my1] = my < y1 ? [my, y1] : [y1, y1];
                  selection = [[x0, my0], [x1, my1]];
              }
              this.move = [x, y];
              this.setState({ selection });
              this.props.onBrush({
                target: this,
                type: 'brush',
                selection,
                sourceEvent: event
              });
              if (mx >= x1 && my >= y1) {
                this.handleSE.setPointerCapture(event.pointerId);
              } else if (mx >= x1) {
                this.handleNE.setPointerCapture(event.pointerId);
              } else if (my >= y1) {
                this.handleSW.setPointerCapture(event.pointerId);
              }
            }
          }}
          onPointerUp={this._handleBrushEnd}
        />
        <rect
          ref={input => (this.handleNE = input)}
          className="handle handle--ne"
          cursor="nesw-resize"
          x={x + w - 5}
          y={y - 5}
          width={10}
          height={10}
          fill="none"
          pointerEvents="visible"
          onPointerDown={this._handleBrushStart}
          onPointerMove={event => {
            if (this.move) {
              const [x, y] = this.props.getEventMouse(event);
              const [sx, sy] = this.move;
              const [dx, dy] = [x - sx, y - sy];
              let [mx, my] = [x1, y0];
              let mx0;
              let mx1;
              let my0;
              let my1;
              let selection = this.state.selection;
              switch (brushType) {
                case '2d':
                  [mx, my] = [xbf(x1 + dx), ybf(y0 + dy)];
                  [mx0, mx1] = x0 < mx ? [x0, mx] : [x0, x0];
                  [my0, my1] = my < y1 ? [my, y1] : [y1, y1];
                  selection = [[mx0, my0], [mx1, my1]];
                  break;
                case 'x':
                  [mx, my] = [xbf(x1 + dx), y0];
                  [mx0, mx1] = x0 < mx ? [x0, mx] : [x0, x0];
                  selection = [[mx0, y0], [mx1, y1]];
                  break;
                case 'y':
                  [mx, my] = [x1, ybf(y0 + dy)];
                  [my0, my1] = my < y1 ? [my, y1] : [y1, y1];
                  selection = [[x0, my0], [x1, my1]];
              }
              this.move = [x, y];
              this.setState({ selection });
              this.props.onBrush({
                target: this,
                type: 'brush',
                selection,
                sourceEvent: event
              });
              if (x0 >= mx && my >= y1) {
                this.handleSW.setPointerCapture(event.pointerId);
              } else if (x0 >= mx) {
                this.handleNW.setPointerCapture(event.pointerId);
              } else if (my >= y1) {
                this.handleSE.setPointerCapture(event.pointerId);
              }
            }
          }}
          onPointerUp={this._handleBrushEnd}
        />
        <rect
          ref={input => (this.handleSE = input)}
          className="handle handle--se"
          cursor="nwse-resize"
          x={x + w - 5}
          y={y + h - 5}
          width={10}
          height={10}
          fill="none"
          pointerEvents="visible"
          onPointerDown={this._handleBrushStart}
          onPointerMove={event => {
            if (this.move) {
              const [x, y] = this.props.getEventMouse(event);
              const [sx, sy] = this.move;
              const [dx, dy] = [x - sx, y - sy];
              let [mx, my] = [x1, y1];
              let mx0;
              let mx1;
              let my0;
              let my1;
              let selection = this.state.selection;
              switch (brushType) {
                case '2d':
                  [mx, my] = [xbf(x1 + dx), ybf(y1 + dy)];
                  [mx0, mx1] = x0 < mx ? [x0, mx] : [x0, x0];
                  [my0, my1] = y0 < my ? [y0, my] : [y0, y0];
                  selection = [[mx0, my0], [mx1, my1]];
                  break;
                case 'x':
                  [mx, my] = [xbf(x1 + dx), y1];
                  [mx0, mx1] = x0 < mx ? [x0, mx] : [x0, x0];
                  selection = [[mx0, y0], [mx1, y1]];
                  break;
                case 'y':
                  [mx, my] = [x1, ybf(y1 + dy)];
                  [my0, my1] = y0 < my ? [y0, my] : [y0, y0];
                  selection = [[x0, my0], [x1, my1]];
              }
              this.move = [x, y];
              this.setState({ selection });
              this.props.onBrush({
                target: this,
                type: 'brush',
                selection,
                sourceEvent: event
              });
              if (x0 >= mx && y0 >= my) {
                this.handleNW.setPointerCapture(event.pointerId);
              } else if (x0 >= mx) {
                this.handleSW.setPointerCapture(event.pointerId);
              } else if (y0 >= my) {
                this.handleNE.setPointerCapture(event.pointerId);
              }
            }
          }}
          onPointerUp={this._handleBrushEnd}
        />
        <rect
          ref={input => (this.handleSW = input)}
          className="handle handle--sw"
          cursor="nesw-resize"
          x={x - 5}
          y={y + h - 5}
          width={10}
          height={10}
          fill="none"
          pointerEvents="visible"
          onPointerDown={this._handleBrushStart}
          onPointerMove={event => {
            if (this.move) {
              const [x, y] = this.props.getEventMouse(event);
              const [sx, sy] = this.move;
              const [dx, dy] = [x - sx, y - sy];
              let [mx, my] = [x0, y1];
              let mx0;
              let mx1;
              let my0;
              let my1;
              let selection = this.state.selection;
              switch (brushType) {
                case '2d':
                  [mx, my] = [xbf(x0 + dx), ybf(y1 + dy)];
                  [mx0, mx1] = mx < x1 ? [mx, x1] : [x1, x1];
                  [my0, my1] = y0 < my ? [y0, my] : [y0, y0];
                  selection = [[mx0, my0], [mx1, my1]];
                  break;
                case 'x':
                  [mx, my] = [xbf(x0 + dx), y1];
                  [mx0, mx1] = mx < x1 ? [mx, x1] : [x1, x1];
                  selection = [[mx0, y0], [mx1, y1]];
                  break;
                case 'y':
                  [mx, my] = [x0, ybf(y1 + dy)];
                  [my0, my1] = y0 < my ? [y0, my] : [y0, y0];
                  selection = [[x0, my0], [x1, my1]];
              }
              this.move = [x, y];
              this.setState({ selection });
              this.props.onBrush({
                target: this,
                type: 'brush',
                selection,
                sourceEvent: event
              });
              if (mx >= x1 && y0 >= my) {
                this.handleNE.setPointerCapture(event.pointerId);
              } else if (mx >= x1) {
                this.handleSE.setPointerCapture(event.pointerId);
              } else if (y0 >= my) {
                this.handleNW.setPointerCapture(event.pointerId);
              }
            }
          }}
          onPointerUp={this._handleBrushEnd}
        />
      </React.Fragment>
    );
  }

  render() {
    return (
      <g className="brush">
        {this._renderOverlay()}
        {this._renderSelection()}
      </g>
    );
  }
}

export default SVGBrush;
