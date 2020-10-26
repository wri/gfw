import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import useRouter from 'utils/router';
import { decodeParamsForState } from 'utils/stateToUrl';

import { getLocationData } from 'services/location';
import { getCountriesProvider } from 'services/country';

import LayoutEmbed from 'layouts/wrappers/embed';
import WidgetEmbed from 'layouts/embed/widget';

import WidgetsEmbedUrlProvider from 'providers/widgets-embed-url-provider';

import {
  setWidgetsSettings,
  setActiveWidget,
} from 'components/widgets/actions';
import allWidgets from 'components/widgets/manifest';

const errorProps = {
  error: 404,
  title: 'Widget Not Found | Global Forest Watch',
  errorTitle: 'Widget Not Found',
};

export const getStaticProps = async ({ params }) => {
  const { location, widget } = params || {};
  const [type] = location || [];

  if (!type || !widget) {
    return {
      props: errorProps,
    };
  }

  const locationData = await getLocationData(location).catch((err) => {
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
      props: errorProps,
    };
  });

  const { locationName } = locationData || {};

  if (!locationName) {
    return {
      props: errorProps,
    };
  }

  return {
    props: {
      widget: widget || '',
      title: `${locationName} Deforestation Rates & Statistics | GFW`,
      description: `Explore interactive tree cover loss data charts and analyze ${locationName} forest trends, including land use change, deforestation rates and forest fires.`,
    },
  };
};

export const getStaticPaths = async () => {
  const widgetsKeys = Object.keys(allWidgets);
  const countryData = await getCountriesProvider();
  const { rows: countries } = countryData?.data || {};
  const countryPaths = countries.map((c) => ({
    params: {
      location: ['country', c.iso],
    },
  }));

  const paths = widgetsKeys.reduce((arr, widgetKey) => {
    const widgetWithLocations = countryPaths.map((c) => ({
      params: {
        ...c.params,
        widget: widgetKey,
      },
    }));

    return [...arr, ...widgetWithLocations];
  }, []);

  return {
    paths: paths || [],
    fallback: true,
  };
};

const WidgetEmbedPage = (props) => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const { query, asPath, isFallback } = useRouter() || {};
  const fullPathname = asPath?.split('?')?.[0];

  useEffect(() => {
    const { widget, ...widgets } = decodeParamsForState(query) || {};

    if (widgets) {
      dispatch(setWidgetsSettings(widgets));
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
  }, []);

  return (
    <LayoutEmbed
      {...props}
      exploreLink={`/dashboards/${query?.location?.join('/')}`}
      noIndex
    >
      {ready && (
        <>
          <WidgetsEmbedUrlProvider />
          <WidgetEmbed embed trase={query?.trase} {...props} />
        </>
      )}
    </LayoutEmbed>
  );
};

WidgetEmbedPage.propTypes = {
  title: PropTypes.string,
  widget: PropTypes.string,
};

export default WidgetEmbedPage;
