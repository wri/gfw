
# Documentation for GFW Layers & Datasets in API

Generic documentation about how to make get, post, patch and del requests to the api can be found in the [RW-API DOCs](https://resource-watch.github.io/doc-api/index-rw.html). This includes basic information about Datasets, Layers, Vocabularies and Metadata.

## Dataset Syntax

Syntax utilised by the front-end which dictate the appearance and behaviour of child layers in the application.

### Vocabulary Tags

Datasets with `application` containing `gfw` may have the vocabulary: `categoryTab`. This vocabulary contaings the field `tags` which is an array of values used to categorise the dataset (and hence, it's attributed layers). The definition used here is that the first element of the `tags` array is the category tab it belongs to, and the second element is the subcategory. E.g. the VIIRS Alerts dataset has a vocabulary `categoryTab` with `tag: ['forestChange', 'fireAlerts']` and hence will be found in the *Forest Chanege* tab under the *Fire Alerts* subcategory.

Note, the subcategories are defined in the GFW codebase - adding a new tag (e.g. [`forestChange`, `myNewTag`]) to a layer will not add a new item to the menu without an update to the corresponding GFW code also.

### Metadata

Each dataset may contain a `metadata` key, which is an array of `application` specific metadata elements. To find metadata specific to the GFW platform filter metadata where `metadata.application == 'gfw'`.

Each metadata element must, by default, contain the keys: `language`, `application`, and `info`.

The `info` value is an object with an open schema, and is used to hold information about how the appearance in the slide out tabs and legend should behave, as well as the hold the dataset's metadata key.

- `info.name` human readable name to be displayed in the slide out tab (string)
- `info.description` subtitle for the layer name, usually containing technical details about the data (string)
- `info.colour` the colour of the toggle (HEX format)
- `info.metadata` the metadata key for the dataset (populates metadata modal)
- `info.isSelectorLayer` indicates that layers should populate a selector drop-down in the legend (bool)
- `info.isMultiLayer` indicates that layers should populate separate toggles in the legend (bool)
- `info.isMultiSelectorLayer` indicates that layers should populate multiple selector drop-down in the legend (bool)
- `info.isLossLayer` indicates that layer is tree cover loss (bool)

NOTE: only include a key if it is to be used and/or `true` i.e. a layer is a *multiLayer* there is no need to include all of the others as *false*.

## Layer Syntax

Syntax that defines how the layer should behave. Specifically: the legend, layer palette, interactions, and searchability.

### iso

At the top layer, the `iso` key conatins an array of iso3 codes of countries that relate to this layer. If empty (or contains a single element: 'global') then the layer is a global layer. This can be used to search and filter layers by location

### applicationConfig

This is an object with open schema and is thus used to define how the layer should behave within the GFW application. It contains:

- `default` - (bool)
- `global` - is the layer a global layer? (bool)
- `active` - should the layer be displayed? (bool)
- `moreInfo` - an object which definds external links in the legend:
    - `moreInfo.linkUrl` - external URL
    - `moreInfo.linkText` - the text for that URL
    - `moreInfo.text` - any additional text or description

NOTE: the `default` and `global` keys are used with the `iso` key to define when to surface datasets/layers when country filters are selected.

Then there are a set of configs for each of the possible legend types:

- `selectorConfig`
    - `selectorConfig.value` - an arbitrary slug matching the layer and the drop-down option (string) [optional]
    - `selectorConfig.label` - label shown on selector
    - `selectorConfig.position` - determines order of layers in the selector
    - `selectorConfig.group` - if multiple selectors, defines how to group them
    - `selectorConfig.groupPosition` - determines the order of the grouped drop-downs 
    -  `selectorConfig.groupLabel` - an arbitrary slug matching the group and the drop-down option (string)
- `multiConfig`
    - `multiConfig.color` - colour of the toggle (HEX)
    - `multiConfig.position` - determines the order of the layers in the legend (int)

### legendConfig

Determines how the legend should appear. 

 - `legendConfig.type` - determines the type of legend. There are 3 types: `basic`, `chloropleth`, and `gradient`.
 
    For `basic` & `chloropleth` define an array of objects with a `name` and `color` field. The basic legend just gives coloured bullets, whereas chloropleth gives a flat segmented line with names beneath.

    For `gradient`, use `value` (can be strings) in place of `name`. These mark regular intervals along the flat bar corresponding to the colour at that point. If you only wish to have 'Low' and 'High' you can leave the `value` field as empty strings ('') far the intermediate items in the array.

- `legendConfig.items` - an array of objects which define the items in the legend:
    - `legendConfig.items[i].name` - label/title of the layer
    - `legendConfig.items[i].color` - colour of the layer if basic or chloropleth type.

### interactionConfig

Defines how tooltips behave on click (currently only available for CARTO layers). Takes the following format:

```json
    "interactionConfig": {
    "output": [
        {
            "column": "name",
            "format": None,
            "prefix": "",
            "property": "Name",
            "suffix": "",
            "type": "string",
            "renderKey": "title"
        },
        ...
    ],
    "type": "intersection",
    "article": True
    }
```
Here `output` is a list of all data surfaced on click. The `column` value must correspond to a CARTO table column. There may also be a key `article` (bool), which is used for tool tips with images and urls (like *Places to Watch)*. If  `Article: True` then the `output` elements should contain a `renderKey` definition so that each output can be rendered correctly. Possible `rendeKey` values are:

- image
- imageCredit
- title
- summary
- meta (link source or country etc) [optional]
- readMoreLink

### layerConfig

The most complicated object within the layer definition - and varies a lot depending on the type of layer/dataset.

See examples.

# All Datasets/Layers

A complete list of all currently used datasets and layers:

```
allLayers = [
    {
        'dataset': 'e663eb09-04de-4f39-b871-35c6c2ed10b5',
        'layer': [
            {'id': '9a370f5a-6631-44e3-a955-7f3884c27d91', 'name': 'GLAD Alerts Staging'},
            {'id': '98d2d65c-df0a-4b6e-b420-8181f44df6f1', 'name': 'Geographic coverage'},
            {'id': 'dd5df87f-39c2-4aeb-a462-3ef969b20b66', 'name': 'GLAD Alerts'},
            {'id': '581ecc62-9a70-4ef4-8384-0d59363e511d', 'name': 'Places to Watch'}
        ]
    },{
        'dataset': '044f4af8-be72-4999-b7dd-13434fc4a394',
        'layer': [
            {'id': 'c05c32fd-289c-4b20-8d73-dc2458234e04', 'name': 'Tree cover 2000'},
            {'id': '78747ea1-34a9-4aa7-b099-bdb8948200f4', 'name': 'Tree cover 2010'}
        ]
    },{
        'dataset': 'b7a34457-1d8a-456e-af46-876e0b42fb96',
        'layer': [
            {'id': 'c9e48a9f-2dca-4233-9400-0b5e4e07674f', 'name': 'Total carbon gains: 2018'},
            {'id': '63dadfc5-b2bb-412c-96eb-67fe98d92dd5', 'name': 'Total carbon gains: 2028'},
            {'id': 'd342d3a6-b483-42a2-ad67-1961473cd8f9', 'name': 'Total carbon gains: 2038'},
            {'id': 'fffa76d3-5008-48b7-afeb-2c7054548f2e', 'name': 'Total carbon gains: 2048'}
        ]
    },{
        'dataset': 'fee5fc38-7a62-49b8-8874-dfa31cbb1ef6',
        'layer': [
            {'id': '43a205fe-aad3-4db1-8807-c399a3264349', 'name': 'Biodiversity Significance'},
            {'id': 'f13f86cb-08b5-4e6c-bb8d-b4782052f9e5', 'name': 'Biodiversity Intactness'}
        ]
    },{
        'dataset': '9c4bc723-6c9b-4cea-92a7-9f0f0f9e7697',
        'layer': [
            {'id': '5192313d-55b4-4eda-8331-fff7b33496f5', 'name': 'Mangroves Forests'}
        ]
    },{
        'dataset': '13e28550-3fc9-45ec-bb00-5a48a82b77e1',
        'layer': [
            {'id': 'fd44b976-62e6-4072-8218-8abf6e254ed8', 'name': 'Intact Forest Landscapes 2000-2016'}
        ]
    },{
        'dataset': '83f8365b-f40b-4b91-87d6-829425093da1',
        'layer': [
            {'id': 'a7ccb4f5-0057-4078-907d-bcd8c280e08b', 'name': 'Plantations by Type'},
            {'id': 'e0f7d731-f80a-49ec-840f-bcd40f092933', 'name': 'Plantations by Species'}
        ]
    },{
        'dataset': '897ecc76-2308-4c51-aeb3-495de0bdca79',
        'layer': [
            {'id': 'c3075c5a-5567-4b09-bc0d-96ed1673f8b6', 'name': 'Tree Cover Loss'}
        ]
    },{
        'dataset': '4fc24a03-cb3e-4df3-a2ee-e2a8dca342b3',
        'layer': [
            {'id': 'c26db41a-b586-461c-b648-93205eafea0b', 'name': 'Managed Forests'}
        ]
    },{
        'dataset': '7a4d9a64-ecb1-45ec-a01e-658f1364fb2e',
        'layer': [
            {'id': 'fcd10026-e892-4fb8-8d79-8d76e3b94005', 'name': 'Mining'}
        ]
    },{
        'dataset': 'c4d4e07c-c5b4-4e2c-9db1-5c3bec185f0e',
        'layer': [
            {'id': '0911abc4-d861-4d7a-84d6-0fa07b51d7d8', 'name': 'Oil Palm'}
        ]
    },{
        'dataset': '93e67a77-1a31-4d04-a75d-86a4d6e35d54',
        'layer': [
            {'id': '557dc2cf-0ba7-4410-813c-99d692725fe7', 'name': 'Wood Fiber'}
        ]
    },{
        'dataset': 'b70f070b-c9ae-4452-aa8e-2280a2604666',
        'layer': [
            {'id': '8b29d89b-f827-4fbf-8978-81290670be8f', 'name': 'Major Dams'}
        ]
    },{
        'dataset': 'aaf2d74a-4a75-441e-9b3c-73bcb590611e',
        'layer': [
            {'id': '3cadd60a-aec8-4e93-a847-8308840c9d59', 'name': 'Congo Basin Logging Roads'}
        ]
    },{
        'dataset': '493ea3f3-90ea-4fc8-89d6-98f1f4ac341f',
        'layer': [
            {'id': '353f9c13-4c6b-4ce8-bb40-0452540d9238', 'name': 'Resource Rights'}
        ]
    },{
        'dataset': 'c8c7e5ae-d7bd-4e00-98e7-48677791d8f6',
        'layer': [
            {'id': '3c8354f9-c076-4aa2-91ab-25668b143350', 'name': 'Oil Palm Mills'}
        ]
    },{
        'dataset': '05a6d516-e045-498d-bc9f-04673990860f',
        'layer': [
            {'id': '309734ad-fd33-4175-b930-25cc77244a30', 'name': 'Brazil Biomes'}
        ]
    },{
        'dataset': '8a0a08ec-1a92-453a-9caa-6927de719357',
        'layer': [
            {'id': '616d6f36-8c2b-45ed-b48c-18574a6e05cf', 'name': 'Canada Petroleum and Natural Gas'}
        ]
    },{
        'dataset': '94e0494e-f652-4ff8-8e4f-8ec0586c4b62',
        'layer': [
            {'id': '07bfab49-d4a6-4ff3-bb97-43cc1b1152e1', 'name': 'Honduras Forest Type'}
        ]
    },{
        'dataset': 'dcf70e60-ff2b-4bc9-a4cb-1f12c0e370c8',
        'layer': [
            {'id': 'c575ebb4-5a6b-4dcb-b0b3-1c8951403afc', 'name': 'Indonesia Leuser Ecosystem'}
        ]
    },{
        'dataset': '795633ea-88ba-4019-b4ed-d9575886e8ee',
        'layer': [
            {'id': 'f8f8bc4d-7a6e-4152-95ed-b20fd572861b', 'name': 'Liberia Mineral Exploration Licenses'}
        ]
    },{
        'dataset': 'c876f097-ad66-4ebc-ac36-a069790ad9a7',
        'layer': [
            {'id': 'aedbcdba-17ca-4504-8a0e-9296f07a61d9', 'name': 'Liberia Mineral Development Agreements'}
        ]
    },{
        'dataset': '936b191c-8119-4752-8472-c918b9638241',
        'layer': [
            {'id': 'd471ff15-7cbf-466f-9953-fdb436da778d', 'name': 'Liberia Mineral Development Exploration License'}
        ]
    },{
        'dataset': 'fb8987b6-7ad8-4172-b6ef-9c8f917fdafb',
        'layer': [
            {'id': '96240b7a-02c8-4f2d-9f3d-ac04bebc5870', 'name': 'Mexico Payments for Ecosystem Services'}
        ]
    },{
        'dataset': '81469de5-176c-487f-9b1a-7217d61de080',
        'layer': [
            {'id': '221d2c6e-120d-4567-808f-de2e82950107', 'name': 'Mexico Forest Zoning by Category'}
        ]
    },{
        'dataset': 'ba9a6f22-c89c-4d8a-b843-bca2067b09de',
        'layer': [
            {'id': 'eb72add0-efda-4b95-9298-75e73b6a3902', 'name': 'Peru Permanent Production Forests'}
        ]
    },{
        'dataset': 'e8b873a3-5665-4b46-ae7e-040c531a77d2',
        'layer': [
            {'id': 'e89c223d-ddd4-4ac4-83a1-cdb79ec04889', 'name': 'USA Conservation Easements'}
        ]
    },{
        'dataset': 'd4550e06-9ae3-4c82-a104-459b58efbba0',
        'layer': [
            {'id': '7223ed76-ee6f-4cb5-bfa8-f2d65ca45f9b', 'name': 'Cambodia Economic Land Concessions'}
        ]
    },{
        'dataset': '9333e015-6699-41e6-b0a6-d44222cadcaf',
        'layer': [
            {'id': '7cb4c5ed-64c7-43ba-bd85-900a77aa0e6e', 'name': 'Cambodia Protected Areas'}
        ]
    },{
        'dataset': 'ab35761b-ac75-4a82-a6b9-8c949a5af4da',
        'layer': [
            {'id': 'ae8aa6b4-cf9a-4627-8964-ff8af264537e', 'name': 'Canada Protected Areas'}
        ]
    },{
        'dataset': '3103075e-64d4-4a52-83a3-1094cf9cf04a',
        'layer': [
            {'id': '19778494-b8ee-4436-9b8c-cea19873bcc5', 'name': 'Indonesia Peat Lands'}
        ]
    },{
        'dataset': '853ba748-f980-40d7-b0d8-d9b0fb5d748c',
        'layer': [
            {'id': 'f58ad702-ea23-4bf3-bfd8-68d2eed8a357', 'name': 'Indonesia Forest Moratorium'}
        ]
    },{
        'dataset': 'c2615e10-584e-4e7f-ba27-7c4f52594150',
        'layer': [
            {'id': '27fe728b-92a6-4308-8f1c-0abdb34cb6b7', 'name': 'Peru Protected Areas'}
        ]
    },{
        'dataset': '3a8e0ae1-fcc5-4a50-abd1-37f158f173ec',
        'layer': [
            {'id': 'ccf5f7a5-6549-4f0c-82a4-bcc88ac392ac', 'name': 'Mexico protected areas'}
        ]
    },{
        'dataset': '759de49c-a599-4369-821a-8d27350b0393',
        'layer': [
            {'id': 'ee1c56cb-6418-4029-8d0b-1b3ae96607fe', 'name': 'Malaysia Peat Lands'}
        ]
    },{
        'dataset': 'f5809771-24eb-4cca-89ab-ea1697272b51',
        'layer': [
            {'id': 'b0d7815e-a2e2-4686-8429-665d0e79f9ed', 'name': 'Sarawak Logging Concessions'}
        ]
    },{
        'dataset': '887a8991-b5d9-421f-9e84-e26d3ed95779',
        'layer': [
            {'id': '61662d11-cc34-48be-a72e-0cbebabac708', 'name': 'Sabah Logging Concessions'}
        ]
    },{
        'dataset': '8d59a30f-9537-44ff-a6ca-29cf5c62a607',
        'layer': [
            {'id': 'b0b75996-1287-4f8f-884a-ff0da931be81', 'name': 'Mexico Forest Cover'}
        ]
    },{
        'dataset': '4251b827-c6dc-4b27-9850-c6c652e18de3',
        'layer': [
            {'id': 'fc493b78-d0cc-4d99-90f7-8285f98ca348', 'name': 'Sabah Timber Plantations Licenses'}
        ]
    },{
        'dataset': '2d6ed2f7-4dc1-42ad-94b9-a65a5594037a',
        'layer': [
            {'id': 'c02c5eb7-c122-413c-84e8-df93143b6d40', 'name': 'Sarawak Licenses for Planted Forests (LPFs)'}
        ]
    },{
        'dataset': '9c00b73f-9a6e-453c-b730-e240b56e5c88',
        'layer': [
            {'id': '7515700e-3679-42fc-a05b-9b4a144266b5', 'name': 'Sarawak Oil Palm Concessions'}
        ]
    },{
        'dataset': '41a26503-d708-4b95-bbde-c613fba04f44',
        'layer': [
            {'id': '2ac2cd50-6b9d-4b7a-b960-325671fc610f', 'name': 'Sarawak Protected Areas'}
        ]
    },{
        'dataset': 'dddcba3c-f746-4787-9915-f24c141a94da',
        'layer': [
            {'id': '27bbbfbe-60c4-4ac0-84c3-bf4be26c3753', 'name': 'USA Land Cover'},
            {'id': '2b4b882b-1d2b-44fd-92b9-a1ffcabe6ca6', 'name': 'USA Land Cover Change'}
        ]
    },{
        'dataset': '10964a62-eff1-469a-8513-770e71f29445',
        'layer': [
            {'id': 'e6c0d961-981a-4016-bf90-775386f2f7ba', 'name': 'USA Forest Ownership Type'}
        ]
    },{
        'dataset': '7411c30d-88e4-487a-b809-3028c60ee207',
        'layer': [
            {'id': '882b0d99-7826-442a-ba06-e5b94658d4e8', 'name': 'RTRS Guides for Responsible Soy Expansion'}
        ]
    },{
        'dataset': '7ce357f0-ca71-45f6-88ab-a2f13568017e',
        'layer': [
            {'id': '60820c54-2950-4b5a-8198-84b61e55ef6a', 'name': 'WRI Oil Palm Suitability Standard'}
        ]
    },{
        'dataset': '6d663b23-5ed8-4d1a-85ff-6cb04d9812d6',
        'layer': [
            {'id': 'c28255e0-75eb-4d8f-a260-a7303fb566f8', 'name': 'Indonesia Forest Area'}
        ]
    },{
        'dataset': '51267795-de96-462f-9dfb-dd1d07b44057',
        'layer': [
            {'id': 'bf171b35-5dd7-4be6-825a-c98b238107de', 'name': 'Indonesia Primary Forest'}
        ]
    },{
        'dataset': '8f96c227-b45a-43a7-9235-d08d722867ba',
        'layer': [
            {'id': 'df321c9d-2099-458f-9d77-eabb6c68763a', 'name': 'Guatemala Forest Density'}
        ]
    },{
        'dataset': 'e5aed7ff-b569-4918-887f-192d66fd95de',
        'layer': [
            {'id': '43300ba5-03c4-4bc1-b02f-d699d9ba91ba', 'name': 'Guatemala Forest Change 2001-2006'},
            {'id': '2fe559f6-9ae7-4a47-87fb-a33a128652ed', 'name': 'Guatemala Forest Change 2006-2010'}
        ]
    },{
        'dataset': '746089a3-0c24-402f-81b6-f8d91fab77fe',
        'layer': [
            {'id': 'cfd95864-1e95-4a7f-bdf8-e47e4bb5815e', 'name': 'Guatemala Forest Cover'}
        ]
    },{
        'dataset': 'f3fc0f1e-aa26-49b6-8741-45df2eea9ac2',
        'layer': [
            {'id': '220080ec-1641-489c-96c4-4885ed618bf3', 'name': 'Brazil Land Cover'}
        ]
    },{
        'dataset': '5da0c609-c20c-4e99-9d2c-3b1120a2983b',
        'layer': [
            {'id': 'd1d52ca8-f716-4f85-afcb-ad1a90d6c321', 'name': 'PRODES Deforestation'},
            {'id': 'd887e0df-6b60-49e4-9b62-a39e7a870278', 'name': 'Geographic Coverage'}
        ]
    },{
        'dataset': '9bd34150-71d2-4fe0-86ae-f8911378d7e3',
        'layer': [
            {'id': 'd3585efd-8700-46a4-aeb6-cfb75b886b44', 'name': 'Population Density'}
        ]
    },{
        'dataset': '35395874-406d-4824-ab88-254353276c22',
        'layer': [
            {'id': 'c8829d15-e68a-4cb5-98a8-d0acff438a56', 'name': 'Gran Chaco Deforestation'},
            {'id': '5d4338d9-8d0b-4e8c-a644-4b4ba35453b6', 'name': 'Geographic Coverage'}
        ]
    },{
        'dataset': '4316b45c-e744-4f4c-9823-142eb7638c8d',
        'layer': [
            {'id': '463537a8-5ebb-43c1-b6a4-2f25b9910028', 'name': 'Indonesia land cover'}
        ]
    },{
        'dataset': '69199c5c-31a3-46e4-9ae2-068160b90d79',
        'layer': [
            {'id': '66203fea-2e58-4a55-b222-1dae075cf95d', 'name': 'FORMA Alerts'},
            {'id': '85f055e0-4fe3-4672-a902-522d9e3beb88', 'name': 'Geographic Coverage'}
        ]
    },{
        'dataset': '8e76424f-18a8-415c-affd-45e1158e148f',
        'layer': [
            {'id': 'defe5c59-c2ea-4bc6-abc9-cda60f4bab96', 'name': 'FORMA Active Clearing Alerts'},
            {'id': '455a7f25-e5a5-4230-9265-d2986c6808a9', 'name': 'Geographic Coverage'}
        ]
    },{
        'dataset': '461e6f3f-c03c-40b2-8a40-47d1354c93bf',
        'layer': [
            {'id': '790b46ce-715a-4173-8f2c-53980073acb6', 'name': 'Terra-i Alerts'},
            {'id': 'b96c688b-09e8-4203-a012-9068aa3ace30', 'name': 'Geographic Coverage'}
        ]
    },{
        'dataset': '588f2f1f-cc62-46aa-9859-befa031412ca',
        'layer': [
            {'id': 'c09767f5-0ff0-419b-a21b-1b0b06f4745f', 'name': 'Land Cover'}
        ]
    },{
        'dataset': '81c802aa-5feb-4fbe-9986-8f30c0597c4d',
        'layer': [
            {'id': 'f10bded4-94e2-40b6-8602-ae5bdfc07c08', 'name': 'Aboveground Live Woody Biomass Density'}
        ]
    },{
        'dataset': 'bd5d7924-611e-4302-9185-8054acb0b44b',
        'layer': [
            {'id': '49e3f955-2bab-4f73-8589-c9c039b8da29', 'name': 'Mangroves 1996'},
            {'id': '2a7db8fd-c3f5-4f2b-a10d-a375e7dba2d8', 'name': 'Mangroves 2007'},
            {'id': '1811af6f-30f4-4957-afab-382a817be27c', 'name': 'Mangroves 2008'},
            {'id': '2e799cee-746a-410e-b370-412dd4edab10', 'name': 'Mangroves 2009'},
            {'id': '9d4f2d65-71bc-4930-baf2-efa63dcd0ab9', 'name': 'Mangroves 2010'},
            {'id': '06e91cb3-8e1d-4920-97fd-f92eb5995546', 'name': 'Mangroves 2015'},
            {'id': '90ca1154-72e1-4667-852b-03bad0a4c013', 'name': 'Mangroves 2016'}
        ]
    },{
        'dataset': '714339c1-c775-4303-aad4-16d975b2f023',
        'layer': [
            {'id': '079fae08-5696-4926-9417-794bd3a7e8dc', 'name': 'Primary Forests'}
        ]
    },{
        'dataset': 'a9cc6ec0-5c1c-4e36-9b26-b4ee0b50587b',
        'layer': [
            {'id': 'b32a2f15-25e8-4ecc-98e0-68782ab1c0fe', 'name': 'Biomass Loss'}
        ]
    },{
        'dataset': '70e2549c-d722-44a6-a8d7-4a385d78565e',
        'layer': [
            {'id': '3b22a574-2507-4b4a-a247-80057c1a1ad4', 'name': 'Tree Cover Gain'}
        ]
    },{
        'dataset': '9b26177b-1a28-4078-a4b9-8267ac4df669',
        'layer': [
            {'id': '1c93c941-b94c-4c59-8fbe-12db4c0aaeaf', 'name': 'Soil Organic Carbon'}
        ]
    },{
        'dataset': 'b67fc529-af07-4443-85a9-24b5cf6f2eae',
        'layer': [
            {'id': 'd33a6dc5-eb74-4c4d-bf3b-1f0054c0e247', 'name': 'Aboveground Mangrove Biomass Density'}
        ]
    },{
        'dataset': 'ae1e485a-5b39-43b3-9a4e-0edc38fd11a6',
        'layer': [
            {'id': '3f0aac4a-7cca-4b77-9a01-95fcf5e98cc0', 'name': 'Emissions from peat drainage'}
        ]
    },{
        'dataset': '3a638102-ab50-4717-a0fe-b27bd79d18c2',
        'layer': [
            {'id': '3c44da8f-159a-41f2-9fdb-448e4cd0923d', 'name': '2010 Endangered Species Sites—Alliance for Zero Extinction (AZE)'}
        ]
    },{
        'dataset': 'a684a9bb-63f2-4bea-bf62-fd5e80d23d75',
        'layer': [
            {'id': 'dfd9deb6-8d39-4640-8571-4389d5d8898a', 'name': '2016 Biodiversity Hotspots'}
        ]
    },{
        'dataset': '3bc67d97-cd01-4242-b72b-315e7f320543',
        'layer': [
            {'id': 'ab579981-e77c-4cd3-b2d4-5b8a279aa173', 'name': '2014 Endemic Bird Areas'}
        ]
    },{
        'dataset': 'b3fa1221-db2a-4826-95a1-37ac0973cc4b',
        'layer': [
            {'id': '3ec29734-4627-45b1-b320-680e4b4b939e', 'name': 'Brazilian Amazon Deforestation Alerts'}
        ]
    },{
        'dataset': '3b12cc5f-4bf8-4857-909e-a8791125bbf1',
        'layer': [
            {'id': 'fdfd426b-11d0-45fc-91f4-3706ebb0e798', 'name': 'Protected Areas by Category'},
            {'id': '847c25b0-c5db-4ee9-b774-2d45a58ef35a', 'name': 'Marine and Terrestrial Protected Areas'}
        ]
    },{
        'dataset': '37198e19-651f-4f79-96fb-3beb2746acd2',
        'layer': [
            {'id': 'd3e870f0-3387-4fbd-b635-80ca554f8a79', 'name': 'Land Rights'}
        ]
    },{
        'dataset': '0f0ea013-20ac-4f4b-af56-c57e99f39e08',
        'layer': [
            {'id': '1c9132c5-4ad6-405f-b39d-8285133813cf', 'name': 'Large Fires (Past Week)'},
            {'id': '2942c28e-e5b4-4003-83ad-93a2566dc6cd', 'name': 'All Fires (Past Week)'},
            {'id': '5371d0c0-4e5f-45f7-9ff2-fe538914f7a3', 'name': 'VIIRS active fires'}
        ]
    },{
        'dataset': 'c7c76cc1-5178-474a-8b6a-60b895e02260',
        'layer': [
            {'id': '42427a55-c8b5-4fac-8db3-a9d59e1b26f7', 'name': 'Tiger Conservation Landscapes and Corridors'}
        ]
    }
```
