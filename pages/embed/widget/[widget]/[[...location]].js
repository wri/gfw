import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import useRouter from 'utils/router';
import { decodeParamsForState } from 'utils/stateToUrl';
import { getLocationData } from 'services/location';

import LayoutEmbed from 'layouts/wrappers/embed';
import WidgetEmbed from 'layouts/embed/widget';

import ConfirmationMessage from 'components/confirmation-message';
import WidgetsEmbedUrlProvider from 'providers/widgets-embed-url-provider';

import {
  setWidgetsSettings,
  setActiveWidget,
} from 'components/widgets/actions';

export const getStaticProps = async (ctx) => {
  let locationData = {};

  try {
    locationData = await getLocationData(ctx?.params?.location);
  } catch (err) {
    locationData = {};
  }

  const { locationName } = locationData || {};

  return {
    props: locationName
      ? {
          widget: ctx?.params?.widget,
          title: `${locationName} Deforestation Rates & Statistics | GFW`,
          description: `Explore interactive tree cover loss data charts and analyze ${locationName} forest trends, including land use change, deforestation rates and forest fires.`,
          noIndex: true,
        }
      : {
          title: 'Widget embed not found',
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

  useMemo(() => {
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

  return ready ? (
    <LayoutEmbed
      {...props}
      exploreLink={`/dashboards/${query?.location?.join('/')}`}
    >
      {props?.title === 'Widget not found' ? (
        <ConfirmationMessage title="Location not found" error large />
      ) : (
        <>
          <WidgetsEmbedUrlProvider />
          <WidgetEmbed embed {...props} />
        </>
      )}
    </LayoutEmbed>
  ) : null;
};

WidgetEmbedPage.propTypes = {
  title: PropTypes.string,
  widget: PropTypes.string,
};

export default WidgetEmbedPage;
