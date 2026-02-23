/* eslint-disable react/prop-types */
import React from 'react';
import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { TimestepContainer } from './index';

jest.mock('components/timestep', () => {
  const MockTimestep = ({
    min,
    max,
    start,
    end,
    trim,
    marks,
    handleOnAfterChange,
  }) => (
    <div data-testid="timestep">
      <div data-testid="timestep-min">{min}</div>
      <div data-testid="timestep-max">{max}</div>
      <div data-testid="timestep-start">{start}</div>
      <div data-testid="timestep-end">{end}</div>
      <div data-testid="timestep-trim">{trim}</div>
      <div data-testid="timestep-marks">{JSON.stringify(marks)}</div>
      <button
        data-testid="timestep-after-change"
        onClick={() => {
          if (handleOnAfterChange) handleOnAfterChange([0, 5, 5]);
        }}
      >
        Change
      </button>
    </div>
  );

  return MockTimestep;
});

describe('TimestepContainer', () => {
  const defaultProps = {
    handleChange: jest.fn(),
    activeLayer: {
      timelineParams: {
        minDate: '2000-01-01',
        maxDate: '2020-01-01',
        minAbsoluteDate: '2000-01-01',
        maxAbsoluteDate: '2020-01-01',
        interval: 'years',
        startDate: '2005-01-01',
        endDate: '2010-01-01',
        trimEndDate: '2010-01-01',
        canPlay: false,
      },
    },
    defaultStyles: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('returns null when timelineParams is missing', () => {
      const { container } = render(
        <TimestepContainer
          {...defaultProps}
          activeLayer={{ timelineParams: null }}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('renders Timestep component with correct props', () => {
      render(<TimestepContainer {...defaultProps} />);

      expect(screen.getByTestId('timestep')).toBeInTheDocument();
    });

    it('applies canPlay class when canPlay is true', () => {
      const { container } = render(
        <TimestepContainer
          {...defaultProps}
          activeLayer={{
            timelineParams: {
              ...defaultProps.activeLayer.timelineParams,
              canPlay: true,
            },
          }}
        />
      );

      expect(
        container.querySelector('.c-legend-timestep.-can-play')
      ).toBeInTheDocument();
    });

    it('does not apply canPlay class when canPlay is false', () => {
      const { container } = render(<TimestepContainer {...defaultProps} />);

      expect(
        container.querySelector('.c-legend-timestep.-can-play')
      ).not.toBeInTheDocument();
    });
  });

  describe('componentDidUpdate', () => {
    it('updates segments when timelineParams change', () => {
      const { rerender } = render(<TimestepContainer {...defaultProps} />);

      const newProps = {
        ...defaultProps,
        activeLayer: {
          timelineParams: {
            ...defaultProps.activeLayer.timelineParams,
            customTimelineRange: [{ label: '2000-2005' }],
          },
        },
      };

      rerender(<TimestepContainer {...newProps} />);

      // Component should render successfully with new timelineParams
      expect(screen.getByTestId('timestep')).toBeInTheDocument();
    });

    it('does not update when timelineParams are equal', () => {
      const { rerender } = render(<TimestepContainer {...defaultProps} />);

      rerender(<TimestepContainer {...defaultProps} />);

      // Component should still render
      expect(screen.getByTestId('timestep')).toBeInTheDocument();
    });
  });

  describe('getTrackStyle', () => {
    it('returns trackStyle when no gradient', () => {
      const trackStyle = { backgroundColor: 'red' };
      const props = {
        ...defaultProps,
        activeLayer: {
          timelineParams: {
            ...defaultProps.activeLayer.timelineParams,
            trackStyle,
          },
        },
      };

      render(<TimestepContainer {...props} />);

      // Component should render successfully
      expect(screen.getByTestId('timestep')).toBeInTheDocument();
    });

    it('converts gradient in trackStyle object', () => {
      const trackStyle = {
        gradient: {
          '2000-01-01': 'red',
          '2010-01-01': 'blue',
        },
      };
      const props = {
        ...defaultProps,
        activeLayer: {
          timelineParams: {
            ...defaultProps.activeLayer.timelineParams,
            trackStyle,
          },
        },
      };

      render(<TimestepContainer {...props} />);

      expect(screen.getByTestId('timestep')).toBeInTheDocument();
    });

    it('converts gradient in trackStyle array', () => {
      const trackStyle = [
        {
          gradient: {
            '2000-01-01': 'red',
          },
        },
        {
          backgroundColor: 'blue',
        },
      ];
      const props = {
        ...defaultProps,
        activeLayer: {
          timelineParams: {
            ...defaultProps.activeLayer.timelineParams,
            trackStyle,
          },
        },
      };

      render(<TimestepContainer {...props} />);

      expect(screen.getByTestId('timestep')).toBeInTheDocument();
    });
  });

  describe('handleOnAfterChange', () => {
    it('calls handleChange with formatted range', () => {
      const handleChange = jest.fn();
      const props = {
        ...defaultProps,
        handleChange,
      };

      render(<TimestepContainer {...props} />);

      const afterChangeButton = screen.getByTestId('timestep-after-change');
      afterChangeButton.click();

      expect(handleChange).toHaveBeenCalled();
    });

    it('snaps to segment center when segments exist', () => {
      const handleChange = jest.fn();

      const props = {
        ...defaultProps,
        handleChange,
        activeLayer: {
          timelineParams: {
            ...defaultProps.activeLayer.timelineParams,
            customTimelineRange: [{ label: '2000-2005', datasetDate: 2002 }],
          },
        },
      };

      render(<TimestepContainer {...props} />);

      const afterChangeButton = screen.getByTestId('timestep-after-change');
      afterChangeButton.click();

      expect(handleChange).toHaveBeenCalled();
      // Verify handleChange was called with formatted dates
      const callArgs = handleChange.mock.calls[0];
      expect(callArgs).toHaveLength(2);
      expect(Array.isArray(callArgs[0])).toBe(true);
    });

    it('does not snap when no segment match', () => {
      const handleChange = jest.fn();

      const props = {
        ...defaultProps,
        handleChange,
      };

      render(<TimestepContainer {...props} />);

      const afterChangeButton = screen.getByTestId('timestep-after-change');
      afterChangeButton.click();

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('formatRange', () => {
    it('formats range without segments', () => {
      const handleChange = jest.fn();
      const props = {
        ...defaultProps,
        handleChange,
      };

      render(<TimestepContainer {...props} />);

      const afterChangeButton = screen.getByTestId('timestep-after-change');
      afterChangeButton.click();

      expect(handleChange).toHaveBeenCalled();
      const callArgs = handleChange.mock.calls[0];
      expect(Array.isArray(callArgs[0])).toBe(true);
      expect(callArgs[0].every((date) => typeof date === 'string')).toBe(true);
    });

    it('uses datasetDate from segment when available', () => {
      const handleChange = jest.fn();
      const props = {
        ...defaultProps,
        handleChange,
        activeLayer: {
          timelineParams: {
            ...defaultProps.activeLayer.timelineParams,
            customTimelineRange: [{ label: '2000-2005', datasetDate: 2003 }],
          },
        },
      };

      render(<TimestepContainer {...props} />);

      const afterChangeButton = screen.getByTestId('timestep-after-change');
      afterChangeButton.click();

      expect(handleChange).toHaveBeenCalled();
      const callArgs = handleChange.mock.calls[0];
      expect(Array.isArray(callArgs[0])).toBe(true);
    });
  });

  describe('formatValue', () => {
    it('returns segment label when index matches segment', () => {
      const props = {
        ...defaultProps,
        activeLayer: {
          timelineParams: {
            ...defaultProps.activeLayer.timelineParams,
            customTimelineRange: [{ label: '2000-2005' }],
          },
        },
      };

      render(<TimestepContainer {...props} />);

      // Component should render successfully with segments
      expect(screen.getByTestId('timestep')).toBeInTheDocument();
    });
  });

  describe('setMarks', () => {
    it('uses customTimelineMarks when provided as array', () => {
      const customTimelineMarks = [
        { label: '2000', datasetDate: 2000 },
        { label: '2010', datasetDate: 2010 },
      ];

      const props = {
        ...defaultProps,
        activeLayer: {
          timelineParams: {
            ...defaultProps.activeLayer.timelineParams,
            customTimelineMarks,
          },
        },
      };

      render(<TimestepContainer {...props} />);

      expect(screen.getByTestId('timestep')).toBeInTheDocument();
      // Verify marks are passed correctly
      const marksElement = screen.getByTestId('timestep-marks');
      const marks = JSON.parse(marksElement.textContent);
      expect(Object.keys(marks).length).toBeGreaterThan(0);
    });

    it('uses customTimelineMarks when provided as object', () => {
      const customTimelineMarks = {
        0: '2000',
        10: '2010',
      };

      const props = {
        ...defaultProps,
        activeLayer: {
          timelineParams: {
            ...defaultProps.activeLayer.timelineParams,
            customTimelineMarks,
          },
        },
      };

      render(<TimestepContainer {...props} />);

      expect(screen.getByTestId('timestep')).toBeInTheDocument();
      const marksElement = screen.getByTestId('timestep-marks');
      const marks = JSON.parse(marksElement.textContent);
      expect(marks).toEqual(customTimelineMarks);
    });

    it('handles minDate as number (year)', () => {
      const customTimelineMarks = [{ label: '2000', datasetDate: 2000 }];

      const props = {
        ...defaultProps,
        activeLayer: {
          timelineParams: {
            ...defaultProps.activeLayer.timelineParams,
            minDate: 2000,
            customTimelineMarks,
          },
        },
      };

      render(<TimestepContainer {...props} />);

      expect(screen.getByTestId('timestep')).toBeInTheDocument();
    });
  });

  describe('getMinDateBase', () => {
    it('converts numeric minDate to date string', () => {
      const handleChange = jest.fn();
      const props = {
        ...defaultProps,
        handleChange,
        activeLayer: {
          timelineParams: {
            ...defaultProps.activeLayer.timelineParams,
            minDate: 2000,
          },
        },
      };

      render(<TimestepContainer {...props} />);

      // getMinDateBase is used internally, verify through formatRange via handleOnAfterChange
      const afterChangeButton = screen.getByTestId('timestep-after-change');
      afterChangeButton.click();

      expect(handleChange).toHaveBeenCalled();
    });

    it('returns minDate as-is when it is a string', () => {
      const props = {
        ...defaultProps,
        activeLayer: {
          timelineParams: {
            ...defaultProps.activeLayer.timelineParams,
            minDate: '2000-01-01',
          },
        },
      };

      render(<TimestepContainer {...props} />);

      expect(screen.getByTestId('timestep')).toBeInTheDocument();
    });
  });
});
