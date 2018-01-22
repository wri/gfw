/* eslint-disable import/first */
import { combineReducers } from 'redux';
import { handleActions } from 'utils/redux';

// Routes
import router from './router';

// Pages
import * as country from 'pages/country/root';

const countryReducers = {
  root: handleActions(country)
};

// Components
import * as ShareComponent from 'components/share';
import * as ModalMetaComponent from 'components/modal-meta';
import * as mapComponent from 'components/map';
import * as storiesComponent from 'pages/country/stories';
import * as headerComponent from 'pages/country/header';
import * as widgetTreeCoverComponent from 'pages/country/widget/widgets/widget-tree-cover';
import * as widgetTreeCoverPlantationsComponent from 'pages/country/widget/widgets/widget-tree-cover-plantations';
import * as widgetIntactTreeCoverComponent from 'pages/country/widget/widgets/widget-intact-tree-cover';
import * as widgetPrimaryTreeCoverComponent from 'pages/country/widget/widgets/widget-primary-tree-cover';
import * as widgetTreeGainComponent from 'pages/country/widget/widgets/widget-tree-gain';
import * as widgetTreeLocatedComponent from 'pages/country/widget/widgets/widget-tree-located';
import * as widgetRelativeTreeCoverComponent from 'pages/country/widget/widgets/widget-relative-tree-cover';
import * as widgetTreeLossComponent from 'pages/country/widget/widgets/widget-tree-loss';
import * as widgetTreeLossPlantationsComponent from 'pages/country/widget/widgets/widget-tree-loss-plantations';
import * as widgetFAOCoverComponent from 'pages/country/widget/widgets/widget-fao-cover';
import * as widgetFAOReforestationComponent from 'pages/country/widget/widgets/widget-fao-reforestation';

// Providers
import * as countryDataProviderComponent from 'pages/country/providers/country-data-provider';

const componentsReducers = {
  share: handleActions(ShareComponent),
  modalMeta: handleActions(ModalMetaComponent),
  map: handleActions(mapComponent),
  stories: handleActions(storiesComponent),
  header: handleActions(headerComponent),
  widgetTreeCover: handleActions(widgetTreeCoverComponent),
  widgetTreeCoverPlantations: handleActions(
    widgetTreeCoverPlantationsComponent
  ),
  widgetIntactTreeCover: handleActions(widgetIntactTreeCoverComponent),
  widgetPrimaryTreeCover: handleActions(widgetPrimaryTreeCoverComponent),
  widgetTreeGain: handleActions(widgetTreeGainComponent),
  widgetTreeLocated: handleActions(widgetTreeLocatedComponent),
  widgetRelativeTreeCover: handleActions(widgetRelativeTreeCoverComponent),
  widgetTreeLoss: handleActions(widgetTreeLossComponent),
  widgetTreeLossPlantations: handleActions(widgetTreeLossPlantationsComponent),
  widgetFAOCover: handleActions(widgetFAOCoverComponent),
  widgetFAOReforestation: handleActions(widgetFAOReforestationComponent)
};

const providersReducers = {
  countryData: handleActions(countryDataProviderComponent)
};

export default combineReducers({
  ...providersReducers,
  ...countryReducers,
  ...componentsReducers,
  location: router.reducer
});
