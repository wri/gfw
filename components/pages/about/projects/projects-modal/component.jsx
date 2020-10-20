import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { Modal, Button } from 'gfw-components';

import './styles.scss';

const AboutProjectsModal = ({ data, onRequestClose }) => (
  <Modal
    open={!!data}
    title={data?.title}
    onRequestClose={onRequestClose}
    className="c-projects-modal"
  >
    <div>
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

AboutProjectsModal.propTypes = {
  data: PropTypes.object,
  onRequestClose: PropTypes.func,
};

export default AboutProjectsModal;
