import {
  FOREST_LOSS_DATASET,
  FOREST_GAIN_DATASET,
  FOREST_EXTENT_DATASET,
  FOREST_LOSS_FIRES_DATASET,
  TREE_COVER_LOSS_BY_DOMINANT_DRIVER_DATASET,
  INTEGRATED_DEFORESTATION_ALERTS,
  CARBON_FLUX_DATASET,
} from 'data/datasets';

// Horizon runs ?prompt= as the first chat message once the person has signed
// in, so a link can carry them straight into a guided conversation.
export const HORIZON_APP_URL = 'https://horizon.globalnaturewatch.org/app';

// Horizon can only analyse its own catalogue, so only GFW datasets with an
// exact Horizon counterpart get a link. Values are Horizon's dataset names so
// the agent picks that dataset rather than a near match. Left out on purpose:
// land-cover (ESA 2015 here, GLAD-based in Horizon) and natural-forests (only
// one class of Horizon's SBTN Natural Lands Map).
export const HORIZON_DATASET_NAMES = {
  [FOREST_LOSS_DATASET]: 'Tree cover loss',
  [FOREST_GAIN_DATASET]: 'Tree cover gain',
  [FOREST_EXTENT_DATASET]: 'Tree cover',
  [FOREST_LOSS_FIRES_DATASET]: 'Tree cover loss due to fires',
  [TREE_COVER_LOSS_BY_DOMINANT_DRIVER_DATASET]:
    'Tree cover loss by dominant driver',
  [INTEGRATED_DEFORESTATION_ALERTS]: 'Integrated alerts',
  [CARBON_FLUX_DATASET]: 'Forest greenhouse gas net flux',
};

const getHorizonUrl = (prompt, { medium, campaign }) => {
  const params = new URLSearchParams({
    prompt,
    utm_source: 'gfw',
    utm_medium: medium,
    utm_campaign: campaign,
  });
  return `${HORIZON_APP_URL}?${params}`;
};

export const getHorizonPrompt = (horizonDatasetName) =>
  `This is a user tutorial: Add ${horizonDatasetName} to the map and ask me what I'd like to analyse. Explain the analysis parameters available and then suggest analysing a country, e.g. Brazil, spelling out for the user how to form and send the prompt.`;

/** The Horizon link for a GFW dataset slug, or null when Horizon lacks it. */
export const getHorizonPromptUrl = (datasetSlug) => {
  const horizonDatasetName = HORIZON_DATASET_NAMES[datasetSlug];
  if (!horizonDatasetName) return null;

  return getHorizonUrl(getHorizonPrompt(horizonDatasetName), {
    medium: 'map-datasets',
    campaign: 'horizon-dataset-prompt',
  });
};

// The person gets a dashboard for their area within seconds, so the prompt
// skips analysis: the note and the reply teach the next steps instead. The
// note stays free of figures because no analysis has run to back them. The
// example prompts are fixed because each was checked on staging to add its
// widget; free ones promised satellite imagery, which Horizon cannot show for
// areas over 50,000 km², and notes making claims no analysis had checked.
const getStarterDashboardSteps = (areaName) =>
  `create a dashboard for it and add one short text note to the dashboard, without figures, that welcomes me and explains how to add analyses, map layers and notes, using these example prompts word for word: "Analyse tree cover loss in ${areaName} and add the chart to my dashboard", "Add the tree cover loss layer to my dashboard" and "Add a note to my dashboard summarising the chart". In your reply, say in two or three short sentences that the dashboard is ready and what the note explains, then suggest my first prompt: "Analyse tree cover loss in ${areaName} and add the chart to my dashboard".`;

// A Horizon dashboard covers one area and Horizon has no world-level area, so
// the Global dashboard's prompt asks for one before building.
export const getHorizonDashboardPrompt = (areaName) => {
  const steps = getStarterDashboardSteps(areaName || '<that area>');
  return areaName
    ? `This is a user tutorial: Create a dashboard for ${areaName} straight away, then show me how to build it up. Select ${areaName} on the map, ${steps}`
    : `This is a user tutorial: Create a dashboard for me straight away, then show me how to build it up. First ask me in one line which country or region it should cover, suggesting one, e.g. Brazil. Once I answer, select that area on the map, ${steps}`;
};

/**
 * The Horizon link for a GFW dashboard. areaName lists the admin levels from
 * the most specific up ("Altamira, Pará, Brazil") so the agent picks the right
 * area; leave it empty for the Global dashboard.
 */
export const getHorizonDashboardPromptUrl = (areaName) =>
  getHorizonUrl(getHorizonDashboardPrompt(areaName), {
    medium: 'dashboards-header',
    campaign: 'horizon-dashboard-prompt',
  });
