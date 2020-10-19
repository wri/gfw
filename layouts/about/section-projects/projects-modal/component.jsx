import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { Modal, Button } from 'gfw-components';

import './styles.scss';

const SectionProjectsModal = ({ data, onRequestClose }) => (
  <Modal open={!!data} onRequestClose={onRequestClose}>
    <div className="c-projects-modal">
      <h3>{data?.title}</h3>
      <p>{data?.description}</p>
      <div className="links">
        {data?.sgf && (
          <Link href="/grants-and-fellowships/projects/">
            <a>
              <Button light round>
                $
              </Button>
            </a>
          </Link>
        )}
        {data?.link && (
          <a href={data.link} target="_blank" rel="noopener noreferrer">
            <Button>LEARN MORE</Button>
          </a>
        )}
      </div>
    </div>
  </Modal>
);

SectionProjectsModal.propTypes = {
  data: PropTypes.object,
  onRequestClose: PropTypes.func,
};

export default SectionProjectsModal;
