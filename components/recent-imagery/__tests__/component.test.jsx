import React from 'react';
import { waitFor } from '@testing-library/react';
import { renderWithRedux } from '../../__tests__/test-utils';
import RecentImageryContainer from '../index';

const mockGetRecentImageryData = jest.fn();
const mockGetMoreTiles = jest.fn();
const mockResetRecentImageryData = jest.fn();
const mockSetRecentImagerySettings = jest.fn();
const mockSetRecentImageryLoading = jest.fn();
const mockSetRecentImageryLoadingMoreTiles = jest.fn();
const mockSetRecentImageryData = jest.fn();
const mockSetRecentImageryDataStatus = jest.fn();
const mockSetMapSettings = jest.fn();

jest.mock('redux/registry', () => ({
  __esModule: true,
  default: {
    registerModule: jest.fn(),
  },
}));

jest.mock('utils/request', () => ({
  cancelToken: jest.fn(() => ({
    token: 'mock-token',
    cancel: jest.fn(),
  })),
  apiRequest: {
    get: jest.fn(() => Promise.resolve({ data: { data: { tiles: [] } } })),
    post: jest.fn(() => Promise.resolve({ data: { data: { attributes: [] } } })),
  },
}));

jest.mock('services/recent-imagery', () => ({
  getRecentTiles: jest.fn(() => Promise.resolve({ data: { data: { tiles: [] } } })),
  getTiles: jest.fn(() => Promise.resolve({ data: { data: { attributes: [] } } })),
  getThumbs: jest.fn(() => Promise.resolve({ data: { data: { attributes: [] } } })),
}));

jest.mock('../actions', () => ({
  getRecentImageryData: (params) => () => {
    mockGetRecentImageryData(params);
    return Promise.resolve();
  },
  getMoreTiles: (params) => () => {
    mockGetMoreTiles(params);
    return Promise.resolve();
  },
  resetRecentImageryData: () => {
    mockResetRecentImageryData();
    return { type: 'resetRecentImageryData' };
  },
  setRecentImagerySettings: (settings) => {
    mockSetRecentImagerySettings(settings);
    return { type: 'setRecentImagerySettings', payload: settings };
  },
  setRecentImageryLoading: (loading) => {
    mockSetRecentImageryLoading(loading);
    return { type: 'setRecentImageryLoading', payload: loading };
  },
  setRecentImageryLoadingMoreTiles: (loading) => {
    mockSetRecentImageryLoadingMoreTiles(loading);
    return { type: 'setRecentImageryLoadingMoreTiles', payload: loading };
  },
  setRecentImageryData: (data) => {
    mockSetRecentImageryData(data);
    return { type: 'setRecentImageryData', payload: data };
  },
  setRecentImageryDataStatus: (status) => {
    mockSetRecentImageryDataStatus(status);
    return { type: 'setRecentImageryDataStatus', payload: status };
  },
}));

jest.mock('components/map/actions', () => ({
  setMapSettings: (settings) => {
    mockSetMapSettings(settings);
    return { type: 'setMapSettings', payload: settings };
  },
}));

describe('RecentImageryContainer', () => {
  const defaultProps = {
    active: true,
    position: { lat: 0, lng: 0 },
    dates: { start: '2023-01-01', end: '2023-12-31' },
    settings: { bands: 'RGB', date: '2023-06-01', weeks: 1 },
    zoom: 10,
    center: { lat: 0, lng: 0 },
    loadingMoreTiles: false,
    dataStatus: { haveAllData: false },
    activeTile: null,
    sources: [],
    datasets: [],
    recentImageryDataset: null,
  };

  const initialState = {
    recentImagery: {
      active: true,
      loading: false,
      dates: { start: '2023-01-01', end: '2023-12-31' },
      settings: { bands: 'RGB', date: '2023-06-01', weeks: 1 },
      position: { lat: 0, lng: 0 },
    },
    map: {
      zoom: 10,
      latLng: { lat: 0, lng: 0 },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = renderWithRedux(
      <RecentImageryContainer {...defaultProps} />,
      { initialState }
    );
    expect(container.firstChild).toBeNull();
  });

  it('calls getRecentImageryData on mount when active', async () => {
    renderWithRedux(
      <RecentImageryContainer {...defaultProps} active />,
      { initialState }
    );

    await waitFor(() => {
      expect(mockGetRecentImageryData).toHaveBeenCalled();
    });
  });

  it('does not call getRecentImageryData on mount when not active', () => {
    renderWithRedux(
      <RecentImageryContainer {...defaultProps} active={false} />,
      { initialState }
    );

    expect(mockGetRecentImageryData).not.toHaveBeenCalled();
  });

  it('calls resetRecentImageryData when deactivated', async () => {
    const { rerender } = renderWithRedux(
      <RecentImageryContainer {...defaultProps} active />,
      { initialState }
    );

    rerender(
      <RecentImageryContainer {...defaultProps} active={false} />
    );

    await waitFor(() => {
      expect(mockResetRecentImageryData).toHaveBeenCalled();
    });
  });
});
