import { connect } from 'react-redux';
import { setModalContactUsOpen } from 'components/modals/contact-us/actions';
import { setModalNewsletterOpen } from 'components/modals/newsletter/actions';
import Component from './component';

export default connect(null, {
  setModalContactUsOpen,
  setModalNewsletterOpen
})(Component);
