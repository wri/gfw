export const profileSectors = [
  {
    value: 'Government',
    label: 'Government/Public Sector',
  },
  {
    value: 'Donor Institution / Agency',
    label: 'Philantropic Organization',
  },
  {
    value: 'Local NGO (national or subnational)',
    label: 'NGO - National or Local',
  },
  {
    value: 'International NGO',
    label: 'NGO - International',
  },
  {
    value: 'UN or International Organization',
    label: 'Intergovernmental/Multilateral Organization',
  },
  {
    value: 'Academic / Research Organization',
    label: 'Academic/Research Organization',
  },
  {
    value: 'Journalist / Media Organization',
    label: 'Journalist/Media Organization',
  },
  {
    value: 'Indigenous or Community-Based Organization',
    label: 'Indigenous or Community-Based Organization',
  },
  {
    value: 'Private sector',
    label: 'Business/Private sector',
  },
  {
    value: 'Individual / No Affiliation',
    label: 'No Affiliation',
  },
  {
    value: 'Other',
    label: 'Other (Write In)',
  },
];

export const newsletterSectors = profileSectors.map((sector) =>
  sector.value === 'Other'
    ? {
        label: 'Other',
        value: sector.value,
      }
    : sector
);

export const interests = [
  'Innovations in Monitoring',
  'Fires',
  'Forest Watcher Mobile App',
  'Climate and Carbon',
  'Biodiversity',
  'Agricultural Supply Chains',
  'Small Grants Fund and Tech Fellowship',
  'Landscape Restoration',
  'GFW Users in Action',
  'Places to Watch alerts',
  'Deforestation',
];

export const howDoYouUse = [
  'Monitor or manage an area',
  'Plan field work (patrols/investigations)',
  'Identify illegal activity',
  'Advocacy/campaigning',
  'Land use planning/land use allocation',
  'Inform grant funding decisions/results-based payments',
  'Monitor results/impacts',
  'General research',
  'Data or visuals for blogs or media stories',
  'Data or visuals for presentations and reports',
  'Learn about forests/my country',
  'Inform purchasing/procurement/investment decisions',
  'Educational support materials',
  'Not sure; new to GFW',
];

export const topics = [
  'Agricultural Supply Chains',
  'Climate and Biodiversity',
  'Fires',
  'Forest Watcher Mobile App',
  'Innovations in Monitoring',
  'Small Grants Fund and Tech Fellowship',
];

export const preferredLanguages = [
  { label: 'English', value: 'en' },
  { label: 'Français', value: 'fr' },
  { label: 'Español', value: 'es' },
  { label: 'Português', value: 'pt' },
  { label: 'Bahasa Indonesia', value: 'id' },
];
