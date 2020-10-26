import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { registerModule } from 'redux/store';

import { getDatasets } from './actions';
import reducers, { initialState } from './reducers';

const DatasetsProvider = () => {
  registerModule({
    key: 'datasets',
    reducers,
    initialState,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDatasets());
  }, []);

  return null;
};

export default DatasetsProvider;
