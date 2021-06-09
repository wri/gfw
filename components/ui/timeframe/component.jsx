import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { Tooltip } from 'react-tippy';

import Icon from './right.svg';

import useTimeline from './hook';

import './styles.scss';

const DOT_SIZE = 12;

const TimeSlider = ({
  dotSize = DOT_SIZE,
  selected = 0,
  periods = [],
  onChange,
}) => {
  const ref = useRef();
  const tileRefs = useRef([]);

  const [
    timeline,
    activeIndex,
    offset,
    labels,
    setSelected,
    moveTimeline,
  ] = useTimeline(ref, tileRefs, periods, selected, dotSize, onChange);

  const [styles, setAnim] = useSpring(() => ({
    from: { transform: `translateX(0px)` },
  }));

  useEffect(() => {
    setAnim({ transform: `translateX(${offset}px)` });
  }, [offset, setAnim, activeIndex]);

  return (
    <>
      <section className="c-timeframe">
        <span className="year-label year-label-start">
          {periods[labels[0]].year}
        </span>
        <span className="year-label year-label-end">
          {periods[labels[1]].year}
        </span>
        <button
          className="prev"
          style={{ width: `${timeline.buttonWidth}px` }}
          onClick={() => moveTimeline('prev')}
        >
          <img src={Icon} alt="arrow-prev" />
        </button>
        <div ref={ref} className="timeframe">
          <animated.ol
            style={{
              width: `${timeline.dataWidth}px`,
              height: '100%',
              position: 'relative',
              zIndex: 2,
              ...styles,
            }}
          >
            {periods.map((d, i) => (
              <li
                key={i}
                ref={(el) => {
                  tileRefs.current[i] = el;
                }}
                data-index={i}
                className="tile"
                style={{
                  width: `${timeline.tileWidth}px`,
                }}
              >
                <Tooltip
                  open={activeIndex === i}
                  title={d.label}
                  position="bottom"
                >
                  <span
                    label={d.label}
                    role="button"
                    tabIndex={0}
                    area-label="Select timeframe"
                    className={`${activeIndex === i ? 'active' : ''}`}
                    onClick={() => {
                      setSelected(i);
                    }}
                    style={{
                      width: `${dotSize}px`,
                      height: `${dotSize}px`,
                    }}
                  />
                </Tooltip>
              </li>
            ))}
          </animated.ol>
          <span className="line" />
        </div>
        <button
          className="next"
          style={{ width: `${timeline.buttonWidth}px` }}
          onClick={() => moveTimeline('next')}
        >
          <img src={Icon} alt="arrow-next" />
        </button>
      </section>
    </>
  );
};

TimeSlider.propTypes = {
  dotSize: PropTypes.number,
  selected: PropTypes.number,
  periods: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
};

export default TimeSlider;
