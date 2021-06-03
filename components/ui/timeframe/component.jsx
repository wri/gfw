import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';

import Icon from './right.svg';

import useTimeline from './hook';

import './styles.scss';

const data = [
  {
    label: 'Apr 2021',
    year: 2021,
    month: 'Apr',
    value: 'planet_medres_normalized_analytic_2021-04_mosaic',
  },
  {
    label: 'Mar 2021',
    year: 2021,
    month: 'Mar',
    value: 'planet_medres_normalized_analytic_2021-03_mosaic',
  },
  {
    label: 'Feb 2021',
    year: 2021,
    month: 'Feb',
    value: 'planet_medres_normalized_analytic_2021-02_mosaic',
  },
  {
    label: 'Jan 2021',
    year: 2021,
    month: 'Jan',
    value: 'planet_medres_normalized_analytic_2021-01_mosaic',
  },
  {
    label: 'Dec 2020',
    year: 2020,
    month: 'Dec',
    value: 'planet_medres_normalized_analytic_2020-12_mosaic',
  },
  {
    label: 'Nov 2020',
    year: 2020,
    month: 'Nov',
    value: 'planet_medres_normalized_analytic_2020-11_mosaic',
  },
  {
    label: 'Oct 2020',
    year: 2020,
    month: 'Oct',
    value: 'planet_medres_normalized_analytic_2020-10_mosaic',
  },
  {
    label: 'Sep 2020',
    year: 2020,
    month: 'Sep',
    value: 'planet_medres_normalized_analytic_2020-09_mosaic',
  },
  {
    label: 'Jun 2020 - Sep 2020',
    year: 2020,
    month: 'Jun/Sep',
    value: 'planet_medres_normalized_analytic_2020-06_2020-08_mosaic',
  },
  {
    label: 'Dec 2019 - Jun 2020',
    year: '2019/2020',
    month: 'Dec/Jun',
    value: 'planet_medres_normalized_analytic_2019-12_2020-05_mosaic',
  },
  {
    label: 'Jun 2019 - Dec 2019',
    year: 2019,
    month: 'Jun/Dec',
    value: 'planet_medres_normalized_analytic_2019-06_2019-11_mosaic',
  },
  {
    label: 'Dec 2018 - Jun 2019',
    year: '2018/2019',
    month: 'Dec-Jun',
    value: 'planet_medres_normalized_analytic_2018-12_2019-05_mosaic',
  },
  {
    label: 'Jun 2018 - Dec 2018',
    year: 2018,
    month: 'June-Dec',
    value: 'planet_medres_normalized_analytic_2018-06_2018-11_mosaic',
  },
  {
    label: 'Dec 2017 - Jun 2018',
    year: '2017/2018',
    month: 'Dec/Jun',
    value: 'planet_medres_normalized_analytic_2017-12_2018-05_mosaic',
  },
  {
    label: 'Jun 2017 - Dec 2017',
    year: 2017,
    month: 'Jun/Dec',
    value: 'planet_medres_normalized_analytic_2017-06_2017-11_mosaic',
  },
  {
    label: 'Dec 2016 - Jun 2017',
    year: '2016/2017',
    month: 'Dec/Jun',
    value: 'planet_medres_normalized_analytic_2016-12_2017-05_mosaic',
  },
  {
    label: 'Jun 2016 - Dec 2016',
    year: 2016,
    month: 'Jun/Dec',
    value: 'planet_medres_normalized_analytic_2016-06_2016-11_mosaic',
  },
  {
    label: 'Dec 2015 - Jun 2016',
    year: '2015/2016',
    month: 'Dec/Jun',
    value: 'planet_medres_normalized_analytic_2015-12_2016-05_mosaic',
  },
].reverse();

const DOT_SIZE = 12;

const TimeSlider = ({ dotSize = DOT_SIZE, selected = 0, periods = [] }) => {
  const ref = useRef();
  const tileRefs = useRef([]);

  const [
    timeline,
    activeIndex,
    offset,
    labels,
    setSelected,
    moveTimeline,
  ] = useTimeline(ref, tileRefs, periods, selected, dotSize);

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
          {data[labels[0]].year}
        </span>
        <span className="year-label year-label-end">
          {data[labels[1]].year}
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
            {data.map((d, i) => (
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
                <span
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
                >
                  {activeIndex === i && (
                    <span className="label">{d.label}</span>
                  )}
                </span>
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
};

export default TimeSlider;
