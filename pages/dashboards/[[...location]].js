import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import useRouter from 'utils/router';
import { decodeParamsForState } from 'utils/stateToUrl';

import { getLocationData } from 'services/location';
import { getCountriesProvider } from 'services/country';

import PageLayout from 'layouts/wrappers/page';
import Dashboards from 'layouts/dashboards';

import DashboardsUrlProvider from 'providers/dashboards-url-provider';

import { setMapSettings } from 'components/map/actions';
import { setModalMetaSettings } from 'components/modals/meta/actions';
import { setDashboardPrompts } from 'components/prompts/dashboard-prompts/actions';
import {
  setWidgetsSettings,
  setWidgetsCategory,
  setShowMap,
  setActiveWidget,
} from 'components/widgets/actions';

const notFoundProps = {
  error: 404,
  title: 'Dashboard Not Found | Global Forest Watch',
  errorTitle: 'Dashboard Not Found',
};

export const getStaticProps = async ({ params }) => {
  const [type] = params?.location || [];

  if (!type || type === 'global') {
    return {
      props: {
        title: 'Global Deforestation Rates & Statistics by Country | GFW',
        description:
          'Explore interactive global tree cover loss charts by country. Analyze global forest data and trends, including land use change, deforestation rates and forest fires.',
      },
    };
  }

  const locationData = await getLocationData(params?.location).catch((err) => {
    if (err?.response?.status === 401) {
      return {
        props: {
          error: 401,
          title: 'Area is private | Global Forest Watch',
          errorTitle: 'Area is private',
        },
      };
    }

    return {
      props: notFoundProps,
    };
  });

  const { locationName } = locationData || {};

  if (!locationName) {
    return {
      props: notFoundProps,
    };
  }

  const title = `${locationName} Deforestation Rates & Statistics | GFW`;
  const description = `Explore interactive tree cover loss data charts and analyze ${locationName} forest trends, including land use change, deforestation rates and forest fires.`;
  const noIndex = !['country'].includes(type);

  return {
    props: {
      title,
      description,
      noIndex,
    },
  };
};

export const getStaticPaths = async () => {
  const countryData = await getCountriesProvider();
  const { rows: countries } = countryData?.data || {};
  const countryPaths = countries.map((c) => ({
    params: {
      location: ['country', c.iso],
    },
  }));

  return {
    paths: ['/dashboards/global/', ...countryPaths] || [],
    fallback: true,
  };
};

const DashboardsPage = (props) => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const { query, asPath, isFallback } = useRouter();
  const fullPathname = asPath?.split('?')?.[0];

  useMemo(() => {
    const {
      map,
      modalMeta,
      dashboardPrompts,
      category,
      areaOfInterestModal,
      showMap,
      widget,
      ...widgets
    } = decodeParamsForState(query) || {};

    if (map) {
      dispatch(setMapSettings(map));
    }

    if (modalMeta) {
      dispatch(setModalMetaSettings(modalMeta));
    }

    if (dashboardPrompts) {
      dispatch(setDashboardPrompts(dashboardPrompts));
    }

    if (widgets) {
      dispatch(setWidgetsSettings(widgets));
    }

    if (category) {
      dispatch(setWidgetsCategory(category));
    }

    if (showMap) {
      dispatch(setShowMap(showMap));
    }

    if (widget) {
      dispatch(setActiveWidget(widget));
    }
  }, [fullPathname, isFallback]);

  // when setting the query params from the URL we need to make sure we don't render the map
  // on the server otherwise the DOM will be out of sync
  useEffect(() => {
    if (!ready) {
      setReady(true);
    }
  });

  return (
    <PageLayout {...props}>
      {ready && (
        <>
          <DashboardsUrlProvider />
          <Dashboards />
        </>
      )}
    </PageLayout>
  );
};

DashboardsPage.propTypes = {
  title: PropTypes.string,
};

export default DashboardsPage;
