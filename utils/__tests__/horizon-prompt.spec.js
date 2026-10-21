import {
  FOREST_LOSS_DATASET,
  INTEGRATED_DEFORESTATION_ALERTS,
} from 'data/datasets';

import {
  HORIZON_APP_URL,
  HORIZON_DATASET_NAMES,
  getHorizonPromptUrl,
  getHorizonDashboardPromptUrl,
} from '../horizon-prompt';

describe('utils/horizon-prompt', () => {
  describe('getHorizonPromptUrl', () => {
    it('links a supported dataset to the Horizon app', () => {
      const url = new URL(getHorizonPromptUrl(FOREST_LOSS_DATASET));

      expect(`${url.origin}${url.pathname}`).toBe(HORIZON_APP_URL);
      expect(url.searchParams.get('utm_source')).toBe('gfw');
    });

    it("names Horizon's dataset in the prompt, not GFW's slug", () => {
      const url = new URL(getHorizonPromptUrl(INTEGRATED_DEFORESTATION_ALERTS));
      const prompt = url.searchParams.get('prompt');

      expect(prompt).toContain('Add Integrated alerts to the map');
      expect(prompt).not.toContain(INTEGRATED_DEFORESTATION_ALERTS);
    });

    it('round-trips the prompt through the query string', () => {
      const url = new URL(getHorizonPromptUrl(FOREST_LOSS_DATASET));

      expect(url.searchParams.get('prompt')).toBe(
        "This is a user tutorial: Add Tree cover loss to the map and ask me what I'd like to analyse. Explain the analysis parameters available and then suggest analysing a country, e.g. Brazil, spelling out for the user how to form and send the prompt."
      );
    });

    it('returns null for a dataset Horizon cannot analyse', () => {
      expect(getHorizonPromptUrl('mangrove-forests')).toBeNull();
      expect(getHorizonPromptUrl(undefined)).toBeNull();
    });

    it('only maps slugs that exist', () => {
      Object.keys(HORIZON_DATASET_NAMES).forEach((slug) => {
        expect(slug).not.toBe('undefined');
      });
    });
  });

  describe('getHorizonDashboardPromptUrl', () => {
    it('links a dashboard to the Horizon app, tagged as the dashboards header', () => {
      const url = new URL(getHorizonDashboardPromptUrl('Pará, Brazil'));

      expect(`${url.origin}${url.pathname}`).toBe(HORIZON_APP_URL);
      expect(url.searchParams.get('utm_source')).toBe('gfw');
      expect(url.searchParams.get('utm_medium')).toBe('dashboards-header');
      expect(url.searchParams.get('utm_campaign')).toBe(
        'horizon-dashboard-prompt'
      );
    });

    it('names the whole admin chain so the agent picks the right area', () => {
      const url = new URL(
        getHorizonDashboardPromptUrl('Altamira, Pará, Brazil')
      );

      expect(url.searchParams.get('prompt')).toBe(
        'This is a user tutorial: Select Altamira, Pará, Brazil on the map and guide me through creating my first dashboard for it. Explain what a dashboard is and what can go on one, then suggest a first analysis to add, spelling out for the user how to form and send the prompt.'
      );
    });

    it('asks the person to choose an area on the Global dashboard', () => {
      const prompt = new URL(getHorizonDashboardPromptUrl('')).searchParams.get(
        'prompt'
      );

      expect(prompt).toContain('ask me which area it should cover');
      expect(prompt).not.toContain('Select');
      expect(getHorizonDashboardPromptUrl(undefined)).toBe(
        getHorizonDashboardPromptUrl('')
      );
    });
  });
});
