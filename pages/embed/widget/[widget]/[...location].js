import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import useRouter from 'utils/router';
import { decodeParamsForState } from 'utils/stateToUrl';

import LayoutEmbed from 'layouts/embed';
import WidgetEmbed from 'pages/dashboards/components/embed';
import ConfirmationMessage from 'components/confirmation-message';
import WidgetsEmbedUrlProvider from 'providers/widgets-embed-url-provider';

import {
  setWidgetsSettings,
  setActiveWidget,
} from 'components/widgets/actions';

import { getServerSideProps as getProps } from '../../../dashboards/[...location]';

export const getServerSideProps = getProps;

const WidgetEmbedPage = (props) => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const { query, asPath } = useRouter();
  const fullPathname = asPath?.split('?')?.[0];

  useMemo(() => {
    const { widget, widgets } = decodeParamsForState(query) || {};

    if (widgets) {
      dispatch(setWidgetsSettings(widgets));
    }

    if (widget) {
      dispatch(setActiveWidget(widget));
    }
  }, [fullPathname]);

  // when setting the query params from the URL we need to make sure we don't render the map
  // on the server otherwise the DOM will be out of sync
  useEffect(() => {
    if (!ready) {
      setReady(true);
    }
  });

  return ready ? (
    <LayoutEmbed
      {...props}
      exploreLink={`/dashboards/${query?.location?.join('/')}`}
    >
      {props?.title === 'Dashboard not found' ? (
        <ConfirmationMessage title="Location not found" error large />
      ) : (
        <>
          <WidgetsEmbedUrlProvider />
          <WidgetEmbed embed />
        </>
      )}
    </LayoutEmbed>
  ) : null;
};

WidgetEmbedPage.propTypes = {
  title: PropTypes.string,
};

export default WidgetEmbedPage;
