import { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Button, Mobile, Desktop } from '@worldresources/gfw-components';

import Icon from 'components/ui/icon';

import infoIcon from 'assets/icons/info.svg?sprite';
import AttributionsContent from './attributions-content';
import AttributionsModal from './attributions-modal';

const MapAttributions = ({ className }) => {
  const [attributionsModalOpen, setAttributionsModalOpen] = useState(false);

  return (
    <>
      <Desktop>
        <div className={cx('c-map-attributions', className)}>
          <AttributionsContent isDesktop />
        </div>
      </Desktop>
      <Mobile>
        <div className={cx('c-map-attributions', className, '-mobile')}>
          <AttributionsContent />
          <Button
            className="attribution-btn"
            size="small"
            round
            dark
            onClick={() => setAttributionsModalOpen(true)}
          >
            <Icon icon={infoIcon} />
          </Button>
        </div>
      </Mobile>

      <AttributionsModal
        open={attributionsModalOpen}
        onRequestClose={() => setAttributionsModalOpen(false)}
      />
    </>
  );
};

MapAttributions.propTypes = {
  className: PropTypes.string,
};

export default MapAttributions;
