/**
 * Mock for Mapbox GL library
 * Provides mock implementations for mapbox-gl components and methods
 */

export const mockMap = {
  on: jest.fn(),
  off: jest.fn(),
  remove: jest.fn(),
  getSource: jest.fn(),
  getLayer: jest.fn(),
  addSource: jest.fn(),
  addLayer: jest.fn(),
  removeSource: jest.fn(),
  removeLayer: jest.fn(),
  setLayoutProperty: jest.fn(),
  setPaintProperty: jest.fn(),
  setFilter: jest.fn(),
  setStyle: jest.fn(),
  getStyle: jest.fn(),
  loadImage: jest.fn(),
  addImage: jest.fn(),
  removeImage: jest.fn(),
  getBounds: jest.fn(() => ({
    getNorth: () => 90,
    getSouth: () => -90,
    getEast: () => 180,
    getWest: () => -180,
  })),
  getCenter: jest.fn(() => ({ lng: 0, lat: 0 })),
  setCenter: jest.fn(),
  getZoom: jest.fn(() => 2),
  setZoom: jest.fn(),
  fitBounds: jest.fn(),
  project: jest.fn(() => ({ x: 0, y: 0 })),
  unproject: jest.fn(() => ({ lng: 0, lat: 0 })),
  queryRenderedFeatures: jest.fn(() => []),
  querySourceFeatures: jest.fn(() => []),
  fire: jest.fn(),
  once: jest.fn(),
  flyTo: jest.fn(),
  easeTo: jest.fn(),
  jumpTo: jest.fn(),
  stop: jest.fn(),
  resize: jest.fn(),
  removeControl: jest.fn(),
  addControl: jest.fn(),
  hasControl: jest.fn(() => false),
  getContainer: jest.fn(() => document.createElement('div')),
  isStyleLoaded: jest.fn(() => true),
  isMoving: jest.fn(() => false),
  isZooming: jest.fn(() => false),
  isRotating: jest.fn(() => false),
};

export const mockMapboxGL = {
  Map: jest.fn(() => mockMap),
  Marker: jest.fn(),
  Popup: jest.fn(),
  NavigationControl: jest.fn(),
  FullscreenControl: jest.fn(),
  GeolocateControl: jest.fn(),
  ScaleControl: jest.fn(),
  AttributionControl: jest.fn(),
  LngLat: jest.fn(),
  LngLatBounds: jest.fn(),
  Point: jest.fn(),
  MercatorCoordinate: jest.fn(),
  supported: jest.fn(() => true),
  accessToken: '',
  version: '1.11.1',
};

// Mock for react-map-gl Map component
export const MockMapComponent = ({ children, ...props }) => {
  return <div data-testid="mock-map" {...props}>{children}</div>;
};

export default mockMapboxGL;
