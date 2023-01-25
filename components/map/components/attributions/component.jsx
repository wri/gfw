import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Button } from 'gfw-components';

import Icon from 'components/ui/icon';

import infoIcon from 'assets/icons/info.svg?sprite';
import AttributionsContent from './attributions-content';
import AttributionsModal from './attributions-modal';

import './styles.scss';

const MapAttributions = ({ className, viewport, map }) => {
  const width = map._container.clientWidth;
  const [attributionsModalOpen, setAttributionsModalOpen] = useState(false);
  const [narrowView, setNarrowView] = useState(width < 900);

  useEffect(() => {
    setNarrowView(width < 900);
  }, [viewport]);

  return (
    <>
      <div className={cx("c-map-attributions", className)}>
        <AttributionsContent narrow={narrowView} />
        {narrowView && (
          <>
            <Button
              className="attribution-btn"
              size="small"
              round
              dark
              onClick={() => setAttributionsModalOpen(true)}
            >
              <Icon icon={infoIcon} />
            </Button>
          </>
        )}
      </div>
      <AttributionsModal
        open={attributionsModalOpen}
        onRequestClose={() => setAttributionsModalOpen(false)}
      />
    </>
  );
};

MapAttributions.propTypes = {
  className: PropTypes.string,
  map: PropTypes.object,
  viewport: PropTypes.object,
};

export default MapAttributions;
