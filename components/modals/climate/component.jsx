import { useRouter } from 'next/router';

import Modal from 'components/modal';

import { setModalClimateOpen, setContactUsOpen } from './actions';

import './styles.scss';

const ModalGFWClimate = () => {
  const {
    query: { gfwclimate },
  } = useRouter();

  return (
    <Modal
      open={!!gfwclimate}
      contentLabel="Global Forest Watch Climate"
      onRequestClose={() => {
        setModalClimateOpen(false);
      }}
      title="Global Forest Watch Climate."
      className="c-gfw-climate-modal"
    >
      <p>
        {`The Global Forest Watch Climate website is no longer available. We
        hope you can find the data and information you're looking for
        here. If not, `}
        <a
          href=""
          onClick={() => {
            setContactUsOpen();
          }}
        >
          contact us
        </a>
        {" and we'll be happy to help."}
      </p>
    </Modal>
  );
};

export default ModalGFWClimate;
