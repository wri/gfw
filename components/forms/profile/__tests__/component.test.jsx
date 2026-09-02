import React from 'react';
import { render, screen } from '@testing-library/react';

import ProfileForm from '../component';

jest.mock('providers/country-data-provider', () => () => null);

const renderForm = () =>
  render(
    <ProfileForm
      initialValues={{}}
      countries={[]}
      saveProfile={() => {}}
      source="profile"
    />
  );

describe('ProfileForm interests', () => {
  it('labels the Places to Watch interest without "alerts"', () => {
    renderForm();

    expect(screen.getByLabelText('Places to Watch')).toBeInTheDocument();
    expect(
      screen.queryByLabelText('Places to Watch alerts')
    ).not.toBeInTheDocument();
  });

  it('keeps the original value so already saved interests stay selected', () => {
    renderForm();

    expect(screen.getByLabelText('Places to Watch')).toHaveAttribute(
      'value',
      'places_to_watch_alerts'
    );
  });

  it('renders the Places to Watch disclaimer beneath the checkbox', () => {
    const { container } = renderForm();

    const disclaimer = container.querySelector('.checkbox-description');
    expect(disclaimer).toBeInTheDocument();
    expect(disclaimer).toHaveTextContent(
      /^Curated leads for investigating potential deforestation\./
    );
    expect(disclaimer).toHaveTextContent(
      /validate the nature of the disturbance\.$/
    );
  });

  it('renders Places to Watch as the last interest', () => {
    const { container } = renderForm();

    const interestsGroup = container
      .querySelector('input[name="interests"][value="places_to_watch_alerts"]')
      .closest('.c-form-checkbox');
    const labels = Array.from(
      interestsGroup.querySelectorAll('.checkbox-label')
    ).map((label) => label.textContent);

    expect(labels[labels.length - 1]).toBe('Places to Watch');
  });
});
