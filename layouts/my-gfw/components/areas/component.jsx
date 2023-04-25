import PropTypes from 'prop-types';

import { Row, Column, Loader } from '@worldresources/gfw-components';

import AreasTable from '../areas-table';
import NoAreas from '../no-areas';

const MyGfwAreas = ({ hasAreas, loading }) => (
  <div className="c-mygfw-areas">
    {loading && <Loader className="mygfw-loader" />}
    {!loading && hasAreas && (
      <Row>
        <Column>
          <AreasTable />
        </Column>
      </Row>
    )}
    {!loading && !hasAreas && <NoAreas />}
  </div>
);

MyGfwAreas.propTypes = {
  hasAreas: PropTypes.bool,
  loading: PropTypes.bool,
};

export default MyGfwAreas;
