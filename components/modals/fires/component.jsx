import Link from 'next/link';
import { useRouter } from 'next/router';

import Modal from 'components/modal';

import { setModalFiresOpen, setContactUsOpen } from './actions';

import './styles.scss';

const ModalGFWFires = () => {
  const { query, pathname } = useRouter();

  let modalText = '';
  if (pathname) {
    if (pathname === '/topics/[topic]' && query.topic === 'fires') {
      modalText = [
        'Welcome to the new home for Global Forest Watch Fires data and insights! ',
        <button
          key="button"
          onClick={() => {
            setContactUsOpen();
          }}
        >
          Contact us
        </button>,
        " if you don't find what you're looking for.",
      ];
    } else if (pathname === '/map/[[...location]]') {
      modalText = [
        `Welcome to the new home for Global Forest Watch Fires data and insights!
        If you're looking for the Fire Report, `,
        <Link
          key="link"
          href="/dashboards/[[...location]]"
          as="/dashboards/global?category=fires"
        >
          <button
            onClick={() => {
              setModalFiresOpen(false);
            }}
          >
            <a>click here</a>
          </button>
        </Link>,
        '.',
      ];
    } else if (
      pathname.includes('dashboards') &&
      query &&
      query.topic === 'fires'
    ) {
      modalText = [
        `Welcome to the new home for Global Forest Watch Fires data and insights!
        Explore the links to fire data and analyses below. `,
        <button
          key="button"
          onClick={() => {
            setContactUsOpen();
          }}
        >
          Contact us
        </button>,
        " if you don't find what you're looking for.",
      ];
    }
  }

  const { gfwfires } = query;

  return (
    <Modal
      open={!!gfwfires && !!modalText}
      contentLabel="Global Forest Watch Fires"
      onRequestClose={() => {
        setModalFiresOpen(false);
      }}
      title="Global Forest Watch Fires."
      className="c-gfw-fires-modal"
    >
      <p>{modalText}</p>
    </Modal>
  );
};

export default ModalGFWFires;
