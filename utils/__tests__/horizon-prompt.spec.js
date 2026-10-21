import {
  FOREST_LOSS_DATASET,
  INTEGRATED_DEFORESTATION_ALERTS,
} from 'data/datasets';

import {
  HORIZON_APP_URL,
  HORIZON_DATASET_NAMES,
  getHorizonPromptUrl,
  getHorizonDashboardPromptUrl,
  getHorizonDashboardLink,
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
        'This is a user tutorial: Create a dashboard for Altamira, Pará, Brazil straight away, then show me how to build it up. Select Altamira, Pará, Brazil on the map, create a dashboard for it and add one short text note to the dashboard, without figures, that welcomes me and explains how to add analyses, map layers and notes, using these example prompts word for word: "Analyse tree cover loss in Altamira, Pará, Brazil and add the chart to my dashboard", "Add the tree cover loss layer to my dashboard" and "Add a note to my dashboard summarising the chart". In your reply, say in two or three short sentences that the dashboard is ready and what the note explains, then suggest my first prompt: "Analyse tree cover loss in Altamira, Pará, Brazil and add the chart to my dashboard".'
      );
    });

    it('asks the person to choose an area on the Global dashboard', () => {
      const prompt = new URL(getHorizonDashboardPromptUrl('')).searchParams.get(
        'prompt'
      );

      expect(prompt).toContain(
        'First ask me in one line which country or region it should cover'
      );
      expect(prompt).toContain(
        'suggest my first prompt: "Analyse tree cover loss in <that area> and add the chart to my dashboard"'
      );
      expect(getHorizonDashboardPromptUrl(undefined)).toBe(
        getHorizonDashboardPromptUrl('')
      );
    });
  });

  describe('getHorizonDashboardLink', () => {
    const names = {
      adm0: { label: 'Brazil' },
      adm1: { label: 'Pará' },
      adm2: { label: 'Altamira' },
    };

    it('names the area from the most specific admin level up', () => {
      const link = getHorizonDashboardLink(
        { type: 'country', adm0: 'BRA', adm1: 14, adm2: 8 },
        names
      );

      expect(link.label).toBe('Altamira, Pará, Brazil');
      expect(link.url).toBe(
        getHorizonDashboardPromptUrl('Altamira, Pará, Brazil')
      );
    });

    it('waits until every selected level has its name', () => {
      expect(
        getHorizonDashboardLink(
          { type: 'country', adm0: 'BRA', adm1: 14 },
          { adm0: names.adm0, adm1: null, adm2: null }
        )
      ).toBeNull();
    });

    it('links the Global dashboard without an area', () => {
      const link = getHorizonDashboardLink(
        { type: 'global' },
        { adm0: null, adm1: null, adm2: null }
      );

      expect(link.label).toBe('Global');
      expect(link.url).toBe(getHorizonDashboardPromptUrl(''));
    });
  });
});
