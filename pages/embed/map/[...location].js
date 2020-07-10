import LayoutEmbed from 'app/layouts/embed';
import Map from 'pages/map';

import { getServerSideProps as getProps } from '../../map/[...location]';

export const getServerSideProps = getProps;

const MapEmbedPage = (props) => (
  <LayoutEmbed {...props} fullScreen>
    <Map embed />
  </LayoutEmbed>
);

export default MapEmbedPage;
