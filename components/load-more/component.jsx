import PropTypes from 'prop-types';
import { Row, Column, Button, Loader } from 'gfw-components';

import './styles.scss';

export const LoadMoreButton = ({
  isLoading = false,
  isVisible = true,
  onClickHandle,
}) => (
  <Column className="c-load-more">
    <Row nested>
      <Column width={[1 / 12, 1 / 3]} />
      <Column width={[5 / 6, 1 / 3]} className="button-wrapper">
        {isLoading && (
          <div className="c-load-more-loader">
            <Loader />
          </div>
        )}
        {!isLoading && isVisible && (
          <Button onClick={() => onClickHandle()}>Load more articles</Button>
        )}
      </Column>
    </Row>
  </Column>
);

LoadMoreButton.propTypes = {
  isLoading: PropTypes.bool,
  isVisible: PropTypes.bool,
  onClickHandle: PropTypes.func,
};

export default LoadMoreButton;
