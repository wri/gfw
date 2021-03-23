import basemapParser from 'data/basemaps';
import * as actions from './actions';

export const initialState = {
  loading: false,
  data: [],
  analytical: null,
  visual: null,
  options: null,
};

const setPlanetBasemaps = (state, { payload }) => {
  const additionalParsing = basemapParser.planet(payload);
  return {
    ...state,
    data: payload,
    ...additionalParsing,
  };
};

const setPlanetBasemapsLoading = (state, { payload }) => ({
  ...state,
  loading: payload,
});

export default {
  [actions.setPlanetBasemaps]: setPlanetBasemaps,
  [actions.setPlanetBasemapsLoading]: setPlanetBasemapsLoading,
};
