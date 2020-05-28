import { createAction, createThunkAction } from 'utils/redux';
import combine from 'turf-combine';
import compact from 'lodash/compact';
import { logEvent } from 'app/analytics';
import useRouter from 'app/router';

import { fetchUmdLossGain } from 'services/analysis';
import { uploadShapeFile } from 'services/shape';
import { getGeostoreKey } from 'services/geostore';

import uploadFileConfig from './upload-config.json';

// store actions
export const setAnalysisData = createAction('setAnalysisData');
export const setAnalysisSettings = createAction('setAnalysisSettings');
export const setAnalysisLoading = createAction('setAnalysisLoading');
export const clearAnalysisError = createAction('clearAnalysisError');
export const clearAnalysisData = createAction('clearAnalysisData');

const getErrorMessage = (error, file) => {
  const fileName = file.name && file.name.split('.');
  const fileType = fileName[fileName.length - 1];

  const title =
    error.response && error.response.status >= 500
      ? "The service can't be reached"
      : `Invalid .${fileType} file format`;
  const desc =
    (error.response &&
      error.response.data &&
      error.response.data.errors &&
      error.response.data.errors[0].detail) ||
    error.message ||
    'It’s quite likely because our service is down, but can you also please check your Internet connection?';

  return {
    title,
    desc,
  };
};

export const getAnalysis = createThunkAction(
  'getAnalysis',
  (location) => (dispatch) => {
    const { type, adm0, adm1, adm2, endpoints } = location;
    logEvent('analysis', {
      action: compact([type, adm0, adm1, adm2]).join(', '),
      label: endpoints?.length && endpoints.map((e) => e.slug).join(', '),
    });
    dispatch(setAnalysisLoading({ loading: true, error: '', data: {} }));
    fetchUmdLossGain(location)
      .then((responses) =>
        dispatch(
          setAnalysisData({
            responses,
            location: {
              endpoints,
              type,
              adm0,
              adm1,
              adm2,
            },
          })
        )
      )
      .catch((error) => {
        const slugUrl = error.config.url.split('/')[4];
        const slug = slugUrl.split('?')[0];
        const layerName = endpoints?.find((e) => e.slug === slug).name;
        const { response } = error;
        const errors =
          response &&
          response.data &&
          response.data.errors &&
          response.data.errors[0];
        const { status } = errors || {};
        const errorMessage =
          layerName && (status >= 500 || !response)
            ? `Shape too large or service unavailable for ${layerName}.`
            : 'Service temporarily unavailable. Please try again later.';
        dispatch(
          setAnalysisLoading({
            data: {},
            location: {},
            loading: false,
            error: errorMessage,
          })
        );
      });
  }
);

export const uploadShape = createThunkAction(
  'uploadShape',
  ({
    shape,
    onCheckUpload,
    onCheckDownload,
    onGeostoreUpload,
    onGeostoreDownload,
    token,
  }) => (dispatch, getState) => {
    dispatch(
      setAnalysisLoading({
        uploading: true,
        loading: false,
        error: '',
        data: {},
      })
    );

    uploadShapeFile(shape, onCheckUpload, onCheckDownload, token)
      .then((response) => {
        if (response && response.data && response.data.data) {
          const { attributes: geojsonShape } = response.data.data;

          // check feature length first to make sure we don't regret it
          const { features } = geojsonShape || {};
          const featureCount = features && features.length;

          // now lets flatten any features into a single multi polygon for consistency
          const geojson = combine(geojsonShape);
          const { geometry } =
            geojson && geojson.features && geojson.features[0];

          if (features && featureCount > uploadFileConfig.featureLimit) {
            dispatch(
              setAnalysisLoading({
                uploading: false,
                error: 'Too many features',
                errorMessage:
                  'We cannot support an analysis for a file with more than 1000 features.',
              })
            );
            logEvent('analysisUploadShape', { label: 'Failed: too many features' });
          } else if (
            features &&
            featureCount === 1 &&
            ['Point', 'LineString'].includes(geometry.type)
          ) {
            dispatch(
              setAnalysisLoading({
                uploading: false,
                error: 'Please upload polygon data',
                errorMessage:
                  'Map analysis counts alerts or hectares inside of polygons. Point and line data are not supported.',
              })
            );

            logEvent('analysisUploadShape', { label: 'Failed: non polygon data' });
          } else {
            getGeostoreKey(geometry, onGeostoreUpload, onGeostoreDownload)
              .then((geostore) => {
                if (geostore && geostore.data && geostore.data.data) {
                  const { id } = geostore.data.data;
                  const { query, type } = getState().location || {};
                  setTimeout(() => {
                    dispatch({
                      type,
                      payload: {
                        type: 'geostore',
                        adm0: id,
                      },
                      ...(query && {
                        query: {
                          ...query,
                          ...(query.map && {
                            map: {
                              ...query.map,
                              canBound: true,
                            },
                          }),
                        },
                      }),
                    });
                    dispatch(
                      setAnalysisLoading({
                        uploading: false,
                        error: '',
                        errorMessage: '',
                      })
                    );
                  }, 300);
                  logEvent('analysisUploadShape', { label: 'Success' });
                }
              })
              .catch((error) => {
                const errorMessage = getErrorMessage(error, shape);

                dispatch(
                  setAnalysisLoading({
                    loading: false,
                    uploading: false,
                    error: errorMessage.title,
                    errorMessage: errorMessage.desc,
                  })
                );

                logEvent('analysisUploadShape', { label: `Failed: ${errorMessage.title}` });
              });
          }
        } else {
          dispatch(
            setAnalysisLoading({
              uploading: false,
              error: 'File is empty',
              errorMessage:
                'Please attach a file that contains geometric data.',
            })
          );
          logEvent('analysisUploadShape', { label: 'Failed: file is empty' });
        }
      })
      .catch((error) => {
        const errorMessage = getErrorMessage(error, shape);

        if (errorMessage.title !== 'cancel upload shape') {
          dispatch(
            setAnalysisLoading({
              loading: false,
              uploading: false,
              error: errorMessage.title,
              errorMessage: errorMessage.desc,
            })
          );
          logEvent('analysisUploadShape', { label: `Failed: ${errorMessage.title}` });
        }
      });
  }
);

export const clearAnalysis = createThunkAction(
  'clearAnalysis',
  () => (dispatch) => {
    const { pushDynamic, query } = useRouter();
    pushDynamic({
      pathname: '/map/[...location]',
      query: { ...query, location: 'global' },
    });
    dispatch(clearAnalysisData());
  }
);
