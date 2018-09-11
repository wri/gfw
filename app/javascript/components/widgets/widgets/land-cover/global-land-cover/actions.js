import { getGlobalLandCover } from 'services/forest-data';

export const getData = ({ params, dispatch, setWidgetData, widget }) => {
  getGlobalLandCover(params)
    .then(response => {
      const data = response.data.rows;
      dispatch(setWidgetData({ data, widget }));
    })
    .catch(error => {
      dispatch(setWidgetData({ widget, error: true }));
      console.info(error);
    });
};

export default {
  getData
};
