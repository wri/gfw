/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class SVGBrush extends PureComponent {
  static defaultProps = {
    extent: [[0, 0], [1, 1]],
    minimumGap: 0,
    maximumGap: 0,
    onBrushStart: event => {},
    onBrush: event => {},
    onBrushEnd: event => {},
    getEventMouse: event => [event.clientX, event.clientY],
    brushType: '2d' // 'x', 'y'
  };

  static propTypes = {
    selection: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    extent: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    minimumGap: PropTypes.number.isRequired,
    maximumGap: PropTypes.number.isRequired,
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
    const { extent: [[x0, y0], [x1, y1]] } = this.props;

    return (
      <rect
        className="overlay"
        pointerEvents="all"
        fill="none"
        x={x0}
        y={y0}
        width={x1 - x0}
        height={y1 - y0}
      />
    );
  }

  _renderSelection() {
    const {
      extent: [[ex0, ey0], [ex1, ey1]],
      scale,
      maximumGap,
      minimumGap,
      brushType
    } = this.props;
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

    const hW = 14;
    const hH = h - 10;

    return (
      <React.Fragment>
        <rect
          className="selection"
          cursor="move"
          fill="#777"
          fillOpacity="0"
          stroke="#333"
          shapeRendering="crispEdges"
          x={x}
          y={y + 1}
          width={w}
          height={h - 2}
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
        <g transform={`translate(${x + w - hW / 2},${y + 5})`}>
          <rect
            ref={input => (this.handleE = input)}
            className="handle handle--e"
            cursor="ew-resize"
            width={hW}
            height={hH}
            fill="none"
            filter="url(#shadow1)"
            pointerEvents="visible"
            onPointerDown={this._handleBrushStart}
            onPointerMove={event => {
              if (this.move) {
                const [x, y] = this.props.getEventMouse(event);
                const [sx, sy] = this.move;
                const dx = x - sx;
                const mx = xbf(x1 + dx);
                const [mx0, mx1] = x0 < mx ? [x0, mx] : [x0, x0];

                // minimum GAP
                const scaleX0 = scale.invert(mx0);
                const scaleX1 = scale.invert(mx1);
                const scaleEX0 = scale.invert(ex0);
                let [smx0, smx1] = [mx0, mx1];

                // minimumGap
                if (minimumGap && scaleX1 - scaleX0 <= minimumGap) {
                  if (scaleX0 <= scaleEX0) {
                    smx0 = ex0;
                    smx1 = scale(scaleX0 + minimumGap);
                  } else {
                    smx0 = scale(scaleX1 - minimumGap);
                  }
                }

                // maximumGAP
                if (maximumGap && scaleX1 - scaleX0 > maximumGap) {
                  smx0 = scale(scaleX1 - maximumGap);
                }

                let selection = this.state.selection;
                switch (brushType) {
                  case '2d':
                  case 'x':
                    selection = [[smx0, y0], [smx1, y1]];
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
          <circle
            cx="7"
            cy={(h - 10) / 2}
            r="3"
            fill="#333"
            cx="7"
            cy={(h - 10) / 2}
            r="3"
            fill="#333"
            pointerEvents="none"
          />
        </g>

        <g transform={`translate(${x - hW / 2},${y + 5})`}>
          <rect
            ref={input => (this.handleW = input)}
            className="handle handle--w"
            cursor="ew-resize"
            width={hW}
            height={hH}
            fill="none"
            filter="url(#shadow1)"
            pointerEvents="visible"
            onPointerDown={this._handleBrushStart}
            onPointerMove={event => {
              if (this.move) {
                const [x, y] = this.props.getEventMouse(event);
                const [sx, sy] = this.move;
                const dx = x - sx;
                const mx = xbf(x0 + dx);
                const [mx0, mx1] = mx < x1 ? [mx, x1] : [x1, x1];

                // GAPs
                const scaleX0 = scale.invert(mx0);
                const scaleX1 = scale.invert(mx1);
                const scaleEX1 = scale.invert(ex1);
                let [smx0, smx1] = [mx0, mx1];

                // minimumGap
                if (minimumGap && scaleX1 - scaleX0 <= minimumGap) {
                  if (scaleX1 >= scaleEX1) {
                    smx0 = scale(scaleEX1 - minimumGap);
                    smx1 = ex1;
                  } else {
                    smx1 = scale(scaleX0 + minimumGap);
                  }
                }

                // maximumGAP
                if (maximumGap && scaleX1 - scaleX0 > maximumGap) {
                  smx1 = scale(scaleX0 + maximumGap);
                }

                let selection = this.state.selection;
                switch (brushType) {
                  case '2d':
                  case 'x':
                    selection = [[smx0, y0], [smx1, y1]];
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
          <circle
            cx="7"
            cy={(h - 10) / 2}
            r="3"
            fill="#333"
            pointerEvents="none"
          />
        </g>
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
