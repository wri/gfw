import PropTypes from 'prop-types';
import { Row, Column, Button } from 'gfw-components';

import './styles.scss';

export const LoadMoreButton = ({ onClickHandle }) => (
  <Column className="c-load-more">
    <Row nested>
      <Column width={[1 / 12, 1 / 3]} />
      <Column width={[5 / 6, 1 / 3]} className="button-wrapper">
        <Button onClick={() => onClickHandle()}>Load more articles</Button>
      </Column>
    </Row>
  </Column>
);

LoadMoreButton.propTypes = {
  onClickHandle: PropTypes.func,
};

export default LoadMoreButton;
