import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import useRouter from 'utils/router';
import { decodeQueryParams } from 'utils/url';

import { getLocationData } from 'services/location';

import LayoutEmbed from 'wrappers/embed';
import WidgetEmbed from 'layouts/embed/widget';

import WidgetsEmbedUrlProvider from 'providers/widgets-embed-url-provider';
import MetaProvider from 'providers/meta-provider';

import {
  setWidgetsSettings,
  setActiveWidget,
} from 'components/widgets/actions';

const errorProps = {
  error: 404,
  title: 'Widget Not Found | Global Forest Watch',
  errorTitle: 'Widget Not Found',
};

const ALLOWED_TYPES = ['geostore', 'global', 'country', 'aoi'];

export const getStaticProps = async ({ params }) => {
  const { location, widget } = params || {};
  const [type] = location || [];

  if (!type || !widget || !ALLOWED_TYPES.includes(type)) {
    return {
      props: errorProps,
    };
  }

  if (type === 'global') {
    return {
      props: {
        widget: widget || '',
        title: `Global Deforestation Rates & Statistics | GFW`,
        description: `Explore interactive tree cover loss data charts and analyze global forest trends, including land use change, deforestation rates and forest fires.`,
      },
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
  return {
    paths: [],
    fallback: true,
  };
};

const WidgetEmbedPage = (props) => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const { query, asPath, isFallback } = useRouter() || {};
  const fullPathname = asPath?.split('?')?.[0];

  useEffect(() => {
    const { widget, ...widgets } = decodeQueryParams(query) || {};

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
      exploreLink={
        ready
          ? `/dashboards/${query?.location?.join('/')}`
          : '/dashboards/global/'
      }
      noIndex
    >
      {ready && (
        <>
          <WidgetsEmbedUrlProvider />
          <MetaProvider />
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
