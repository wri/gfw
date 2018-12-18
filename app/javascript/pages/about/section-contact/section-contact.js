import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createElement, PureComponent } from 'react';
import reducerRegistry from 'app/registry';

import * as actions from './section-contact-actions';
import reducers, { initialState } from './section-contact-reducers';
import Component from './section-contact-component';

const mapStateToProps = ({ contact }) => ({
  showConfirm: contact.showConfirm,
  submitting: contact.submitting,
  error: contact.error
});

class SectionContactContainer extends PureComponent {
  handleSubmit = values => {
    const { sendContactForm } = this.props;
    const language = window.Transifex
      ? window.Transifex.live.getSelectedLanguageCode()
      : 'en';
    sendContactForm({ ...values, language });
  };

  render() {
    return createElement(Component, {
      ...this.props,
      handleSubmit: this.handleSubmit
    });
  }
}

SectionContactContainer.propTypes = {
  sendContactForm: PropTypes.func.isRequired
};

reducerRegistry.registerModule('contact', {
  actions,
  reducers,
  initialState
});
export default connect(mapStateToProps, actions)(SectionContactContainer);
