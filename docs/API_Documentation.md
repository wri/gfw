
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
            "format": null,
            "prefix": "",
            "property": "Name",
            "suffix": "",
            "type": "string",
            "renderKey": "title"
        },
        ...
    ],
    "type": "intersection",
    "article": true
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

In general the `layerConfig` defines:

- *where the source data comes from*
- *how to style that data*
- *how to animate the data* (optional, vectors only)

To do this, the application employs the [Layer Manager ver. 3.0](https://github.com/Vizzuality/layer-manager) specification.

Though the `layerConfig` object varies from layer to layer they can be grouped into several broad categories depending on their data source and type:

|  type  	|   provider   	|                                          notes                                          	|
|:------:	|:----------:	|:---------------------------------------------------------------------------------------:	|
| Vector 	| tile layer 	|             *Vector tiles from some tile-cache endpoint. Dynamically styled.*             	|
| Vector 	|    carto   	|                      *Vector tiles from Cartodb. Dynamically styled.*                	|
| Vector 	|   mapbox   	|              *Vector tiles served from Mapbox. Dynamically styled.*                 	|
| Raster 	| tile layer 	|          *Raster tiles served from some tile-cache endpoint. Pre-styled.*         	|
| Raster 	|   decode   	| *RGB-encoded raster tiles served from some tile-cache. Required decoding before styling.* 	|
| Raster 	|     gee    	|    *Served from Google Earth Engine and cached in the wri api. Styled using SLD spec.*   	|

All layers of type *Vector* are styled (and in some cases animated) using the [Mapbox Specification](https://docs.mapbox.com/mapbox-gl-js/style-spec/).

#### Common layerConfig Keys

Regardless of the *type* and *source* of the layer's data, there are some common key definitions:

|       key       	|                              function                             	|
|:---------------:	|:-----------------------------------------------------------------:	|
|      render     	| Define how to style the layer                                     	|
|      source     	| Defines the layer's data source(s) and how to fetch it            	|
|  params_config  	| Defines variable that can be used or inserted into the source url 	|
| timeline_config 	| Defines animation params e.g. step interval, speed etc            	|
|  decode_config  	| Defines params to be used in the decode of RGB values             	|
| decode_function 	| Defines the function to be used to decode RGB values              	|

### Example Layers (*c. May 2020*)

The following is a list of currently in-use production layers.

| name                                                          	| provider   	| type   	| layer_id                                                                    	|
|---------------------------------------------------------------	|------------	|--------	|-----------------------------------------------------------------------------	|
| Alliance for Zero Extinction sites - 2019                     	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/04118785-27f4-4fb0-8980-a786a44f5c6d 	|
| Biodiversity hot spots - 2016                                 	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/8e9a86e2-5e34-452e-bf55-d7c6648ea42e 	|
| BirdLife Endemic Bird Areas - 2014                            	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/5dd45d79-7d09-421d-b7b9-baca3db3820d 	|
| Brazil biomes - 2004                                          	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/2f754096-a23c-4c7b-bee5-d5c414b4026b 	|
| Cambodia economic land concessions - 1995-2015                	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/cf355c2a-04d5-4410-a54e-cae296196a80 	|
| Cambodia protected areas - 1993-2014                          	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/f72e7a11-e0e2-4cbc-a645-5593d3f050fa 	|
| Canada petroleum and natural gas - 2016                       	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/caa4f921-dcb2-4a53-80b9-c85fda5e6dbf 	|
| Canada protected areas - 2015                                 	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/f611a6b9-cc1b-4111-8650-8ef9c395be00 	|
| Carbon dioxide emissions from tree cover loss in drained peat 	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/62139f59-e2c1-4ce0-82d4-626ed68d3ecf 	|
| Congo Basin logging roads - 2014                              	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/35b17f0d-3537-41dc-9bf3-27174fddf9e2 	|
| Disputed Political Boundaries                                 	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/cc35432d-38d7-4a03-872e-3a71a2f555fc 	|
| Emerging hot spots                                            	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/4a8b3393-1785-4f73-b949-9917e2e2b416 	|
| Fire Alerts (VIIRS)                                           	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/93e33932-3959-4201-b8c8-6ec0b32596e0 	|
| Geographic coverage                                           	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/2284c6fc-403f-42c1-9b45-cf9aa3f73ff2 	|
| Geographic coverage                                           	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/a24953f8-7d4d-4f44-80cb-0ad16b759fdc 	|
| Geographic coverage                                           	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/d415c475-2927-42ab-8cff-2049f0072403 	|
| Honduras forest type - 2013                                   	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/bfa9d4ba-2dd6-4899-9027-d8eac9a66846 	|
| Indonesia forest area                                         	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/f84af037-4e4f-41cf-a053-94a606071232 	|
| Indonesia forest moratorium - 2018                            	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/4b269f12-2f1a-4d38-b3a1-01cc1a0453ac 	|
| Indonesia land cover - 2017                                   	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/e07efebb-e1b7-4c0c-abb7-b8e1c514319b 	|
| Indonesia Leuser ecosystem - 2013                             	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/2af0ff6c-26cc-4620-9889-27787a2671d0 	|
| Indonesia peat lands - 2012                                   	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/96d529a1-ade4-4cd1-bfe8-f94e6e3cdcae 	|
| Intact Forest Landscapes - 2000-2016                          	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/af4e9e0b-cbf9-437b-80cb-9b0f795161ca 	|
| Land rights                                                   	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/a0c1b479-10ed-4538-9c8d-cdc9815b7054 	|
| Liberia mineral development agreements                        	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/329a5130-9e9b-4635-b2df-f91ecfd52a99 	|
| Liberia mineral development exploration license               	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/5ef4fb04-de42-4bd4-a5f8-27c98ea9f11f 	|
| Liberia mineral exploration licenses                          	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/c6df9658-2717-4288-b1a0-c670baa7f31a 	|
| Logging concessions - 2018                                    	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/08fd9f5d-51c4-4c01-8c37-d63e86a0de30 	|
| Major dams - 2014                                             	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/d5f69c5a-14c5-46ee-81c8-bad794e52471 	|
| Malaysia peat lands - 2004                                    	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/dc129899-7410-4351-b595-2a288d429934 	|
| Mangrove forests - (1996–2010)                                	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/09fff1c0-c048-4e5d-ac14-909281d0c29b 	|
| Mangrove forests - (1996–2016)                                	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/dfa48856-84c3-4205-bac7-d672169ee0dc 	|
| Mangrove forests - (2010-2016)                                	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/30a73b6d-1cae-445f-83ea-70518d929200 	|
| Mangrove forests - 1996                                       	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/9b4ba439-d5c9-412f-9628-683152b03093 	|
| Mangrove forests - 2007                                       	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/dd904ffa-ff10-4af1-91d1-d3535093f326 	|
| Mangrove forests - 2008                                       	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/2789977c-cee8-49a9-b4e3-90846fab2390 	|
| Mangrove forests - 2009                                       	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/c8522570-f3bb-4a45-a65d-25f6817c8f2f 	|
| Mangrove forests - 2010                                       	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/bc734a74-9125-4baa-97b1-6be818592203 	|
| Mangrove forests - 2015                                       	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/bbe3c519-6ea2-4060-a120-a27b3ada1215 	|
| Mangrove forests - 2016                                       	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/26818337-d91d-4e80-9cd7-dc246c1461c7 	|
| Mexico forest zoning by category - 2011                       	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/88bfc6b9-1962-4fea-b179-ecff5ac236f7 	|
| Mexico payments for ecosystem services - 2011-2015            	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/50f5209c-97a6-47f5-bb79-75dfc904eedf 	|
| Mexico protected areas - 2011-2016                            	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/0d723e17-323f-45a0-bfd5-5dc211875874 	|
| Oil and gas concessions                                       	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/52faa38e-3fcd-4109-85a8-7da8b2b433cf 	|
| Oil palm concessions                                          	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/aef0a3e5-729e-4f1a-9b1c-25a73c7ea4c1 	|
| Palm oil mills - 2019                                         	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/4167a83a-d401-4c5f-bb27-55785ca51228 	|
| Peru forest concessions - 2015                                	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/bcb74ae0-94d4-482c-8b34-c8dbe20d7cf2 	|
| Peru forest concessions by type - 2015                        	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/04b547fc-1cd6-4690-9360-e403614b87d1 	|
| Peru permanent production forests - 2015                      	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/2862a3c9-3809-401c-94fc-b2bd29f9255a 	|
| Peru protected areas - 2016                                   	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/9d0a910a-f119-411c-a5cc-3206657a2c92 	|
| Places to Watch                                               	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/40816dac-d957-47bd-82e4-22f8840601eb 	|
| Political boundaries                                          	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/b45350e3-5a76-44cd-b0a9-5038a0d8bfae 	|
| PRODES deforestation                                          	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/b3529b7f-8fdd-4d10-a6eb-71c6effcbcd5 	|
| Protected areas - 2019                                        	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/f135d3cf-44d0-454e-8e82-87ce43b46a68 	|
| Protected areas (dashboard)                                   	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/fc2d9dea-4238-4343-a2ed-2079c2c6a6c7 	|
| Resource rights                                               	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/5f357ec8-3541-4c35-b386-6230bd384147 	|
| River basin boundaries                                        	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/6a18fc40-18ff-4c4d-bad6-685a5e1ad0fa 	|
| RSPO oil palm concessions - 2017                              	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/5ce140d9-260b-4e42-8b15-bd62193a5955 	|
| Sabah logging concessions - 2014                              	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/a2cf4f96-c7a8-40d3-b26b-ec9fd8da3a51 	|
| Sabah timber plantations licenses - 2014                      	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/4447562b-1a25-4e8e-b576-a6ab06ae6c92 	|
| Sarawak licenses for planted forests (LPFS) - 2011            	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/abcb728a-cee3-4f64-8533-2e0b1e4c3443 	|
| Sarawak logging concessions - 2010                            	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/e39967ac-260c-49f0-a9c1-b9c4f90709fa 	|
| Sarawak oil palm concessions - 2010                           	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/05b41fa1-6fe4-4a36-b661-a562000f9265 	|
| Sarawak protected areas - 2010-2014                           	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/846c2b1b-da5a-4133-876e-004099672dd1 	|
| Terrestrial ecoregions                                        	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/dff7fb25-5db1-4afe-b66a-65ed14fa557d 	|
| Tiger Conservation Landscapes - 2007-2014                     	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/9df142fb-d56d-4001-90fb-a0008117793e 	|
| USA conservation easements - 2014                             	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/1389d434-400b-4de3-a831-c96dd7c0c741 	|
| Wood fiber concessions by type - 2019                         	| carto      	| vector 	| https://api.resourcewatch.org/v1/layer/82229960-13c2-4810-84e7-bdd4812d4578 	|
| Biodiversity intactness - 2016                                	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/bd2798d1-c771-4bff-84d9-c4d69d3b3121 	|
| Biodiversity significance - 2016                              	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/c1c306a3-31b6-409a-acf0-2a8f09e28363 	|
| Brazil land cover 1985                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/e45988eb-91e1-4af3-b46f-d05852443a23 	|
| Brazil land cover 1986                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/b59ff861-086e-4089-a476-a0c115a1b668 	|
| Brazil land cover 1987                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/280030fb-080b-410f-a06f-a8b539593592 	|
| Brazil land cover 1988                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/01522269-e2bd-44c1-9d89-c2132c9ed2fb 	|
| Brazil land cover 1989                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/58cebbad-733a-4757-8fca-8eca533fc7e2 	|
| Brazil land cover 1990                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/e5d5ebcf-2685-4bb8-b5cd-966391c07a21 	|
| Brazil land cover 1991                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/76c70979-ed5d-489f-86e3-8c4d1211eb5f 	|
| Brazil land cover 1992                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/9adf01cf-5391-4051-a90c-aff11042e6f4 	|
| Brazil land cover 1993                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/80db67dc-f464-4981-b364-5c12d807de4a 	|
| Brazil land cover 1994                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/d5d05c08-0c49-4a93-a706-65c8004c8ba2 	|
| Brazil land cover 1995                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/a3f41e53-2ff0-46bf-883c-65edc73cd1a1 	|
| Brazil land cover 1996                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/c3e0446c-d07d-4548-b8d2-0fba4204ed88 	|
| Brazil land cover 1997                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/6c8ed840-cbc4-44ca-bf38-3d871dfbecbd 	|
| Brazil land cover 1998                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/2929ad2c-cc0f-42e3-8829-f506e1e89f56 	|
| Brazil land cover 1999                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/211392b9-5370-46de-b697-90e114e9d3da 	|
| Brazil land cover 2000                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/bdcfa995-6d0b-4872-b4e0-993fa3d8807b 	|
| Brazil land cover 2001                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/7c247437-9e8b-4c64-ab96-2f9dd7d2e701 	|
| Brazil land cover 2002                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/9a569c02-c5e2-4e06-9f9f-08635e7e6a4c 	|
| Brazil land cover 2003                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/63a121ef-d850-4a39-b913-143882185b02 	|
| Brazil land cover 2004                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/6b4582b9-61cc-4349-832e-ffc4a0b5a472 	|
| Brazil land cover 2005                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/1f968961-e5ee-447b-96f7-9d4959ad2c0f 	|
| Brazil land cover 2006                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/e7d307a1-7b4a-4ba2-a1be-aacbf36383b7 	|
| Brazil land cover 2007                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/7043b623-5625-4685-b6f2-aaefb919eb0e 	|
| Brazil land cover 2008                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/cb2d4546-670d-4e6d-aaaa-539505b6f423 	|
| Brazil land cover 2009                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/6f068255-cdff-4dd1-aacd-2ea3c063eb71 	|
| Brazil land cover 2010                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/921cb771-c821-4cc4-bb5c-394b3960e5db 	|
| Brazil land cover 2011                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/ac0515e7-d2a6-4e7c-9bf5-0017cd19fb1e 	|
| Brazil land cover 2012                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/4f1314f7-a59b-412b-a57f-c2585025bd0a 	|
| Brazil land cover 2013                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/daac1887-0417-48f6-b899-7f6584227618 	|
| Brazil land cover 2014                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/9c0f0d0b-73a2-4acc-b1c2-1ad6d7681f34 	|
| Brazil land cover 2015                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/65c3871e-f4b7-4fd2-8b95-04548dc0fd66 	|
| Brazil land cover 2016                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/da57458a-107d-4ed5-88ed-07e03f328693 	|
| Brazil land cover 2017                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/ed13c7ac-5ea1-49e3-9d3a-38dbf445a178 	|
| Mangrove biomass density                                      	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/5196c6da-d5d2-4fbe-aef2-6aa882afbd7f 	|
| Population density - 2015                                     	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/24aaef77-3cee-4bdd-b6c9-2f5ab147db7d 	|
| Potential carbon gains in cropland - 2018                     	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/d8d9e3ae-c6f3-41b5-b3a8-9bc0629a45f2 	|
| Potential carbon gains in cropland - 2028                     	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/1864947b-9fd4-4031-8f84-62a71c6e9536 	|
| Potential carbon gains in cropland - 2038                     	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/29d3e4e9-de51-42c0-afcb-5b4316cf4012 	|
| Potential carbon gains in cropland - 2048                     	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/804646ce-5a8f-4f09-935a-28be4a2d2ee8 	|
| Potential carbon gains in pastures - 2018                     	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/bbc3dd5a-cb1b-47c4-b369-953237018560 	|
| Potential carbon gains in pastures - 2028                     	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/f3ac8b80-32b9-438e-8a42-c38a143b4965 	|
| Potential carbon gains in pastures - 2038                     	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/c342ebdd-31b0-4875-ad74-6a01e23d4743 	|
| Potential carbon gains in pastures - 2048                     	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/1cc73ad5-f218-4797-9099-9031d7361c01 	|
| Potential carbon gains in young second-growth forests - 2018  	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/ae18ed7c-f852-44f8-9e99-ecc1314bf298 	|
| Potential carbon gains in young second-growth forests - 2028  	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/0e2892bc-4844-450c-a163-a808bec319d1 	|
| Potential carbon gains in young second-growth forests - 2038  	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/8dea3c1f-cdef-4279-aa97-e9b7d8c7b514 	|
| Potential carbon gains in young second-growth forests - 2048  	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/0cae9a9a-2a80-46eb-8c04-0ef7876d30b0 	|
| Primary forests - 2001                                        	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/41086554-5ca5-456c-80dd-f6bee61bc45f 	|
| Projected carbon storage from forest regrowth                 	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/b8a993f3-cccf-4f43-a39b-a4f7e59000f0 	|
| Soil carbon density                                           	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/d86c0afe-298a-4f7d-be69-e398b6a8ab20 	|
| Total potential carbon gains - 2028                           	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/217de2bc-9e88-45ab-9fce-902f61a9ae3e 	|
| Total potential carbon gains - 2038                           	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/a08a9344-adb0-42a2-abb2-e34d5f7ad087 	|
| Total potential carbon gains - 2048                           	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/adc98378-1a0b-4b57-8c18-27848ad3ca31 	|
| USA Land Cover - 2001                                         	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/578b7ffe-ce22-4ede-b51d-dbe16dc22af8 	|
| USA Land Cover - 2006                                         	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/7a9b0a06-7fda-4e12-824a-c9ae1ced3177 	|
| USA Land Cover - 2011                                         	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/1ba24fc2-c826-4871-ae7e-c799669c37c7 	|
| USA Land Cover - 2016                                         	| GEE        	| raster 	| https://api.resourcewatch.org/v1/layer/d5b0a81b-70cd-4f33-860a-34a3c17867f3 	|
| Mongabay stories                                              	| geojson    	| vector 	| https://api.resourcewatch.org/v1/layer/51c9b85c-1e7a-4b79-8041-d906251c0d68 	|
| Mining concessions                                            	| mapbox     	| vector 	| https://api.resourcewatch.org/v1/layer/b8dbd752-08ea-4538-b15a-107a05f11463 	|
| Tree plantations                                              	| mapbox     	| vector 	| https://api.resourcewatch.org/v1/layer/f2604a93-8059-4b24-9d02-c43ac224e286 	|
| Carbon dioxide emissions from tree cover loss                 	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/929662b6-3bf8-4413-b4b3-9b8c116f68bb 	|
| Deforestation alerts (GLAD)                                   	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/8e4a527d-1bcd-4a12-82b0-5a108ffec452 	|
| Deforestation alerts (Terra-i)                                	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/50a76478-9f6e-4315-874a-611d10a50338 	|
| GLAD alerts (Confirmed Only)                                  	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/40247642-7c89-49f3-9c1e-521913a06ae8 	|
| Guatemala forest change - 2001-2006                           	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/435d5254-c44e-49e2-9e31-0ff12b5f0514 	|
| Guatemala forest change - 2001-2006                           	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/20152c7f-cbd7-4ed8-b483-06f0495c68b3 	|
| Guatemala forest cover - 2012                                 	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/86fe7099-4c2c-4171-b11a-57c7ff7e4e57 	|
| Guatemala forest density - 2012                               	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/a2795ace-ca08-4dd0-829a-c39580804ec8 	|
| Indonesia primary forest - 2000                               	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/60eb4495-dc01-459e-ba18-4a0c820d9619 	|
| Land Cover - 2015                                             	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/e67f4276-c1d0-4970-b2d6-6dd17843f4c9 	|
| Mexico forest cover - 2013-2014                               	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/c396b4aa-737b-4d3c-a3fe-fd292b4a455b 	|
| Recent Satellite                                              	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/babd9968-4b55-4bc5-b771-d471ef8fbd8c 	|
| RTRS Guides for Responsible Soy Expansion - 2015              	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/bd0f1b68-4d70-41bd-bfb2-1831efc0c26e 	|
| Tree biomass density                                          	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/1a1199e2-896b-4051-9419-eb4f67c554a7 	|
| Tree cover - 2000                                             	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/0cba3c4f-2d3b-4fb1-8c93-c951dc1da84b 	|
| Tree cover - 2010                                             	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/2351399c-ef2c-48da-9485-20698190acb0 	|
| Tree cover gain - 2001-2012                                   	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/0abe4aea-cc86-4c75-8c16-2f16bf78d8be 	|
| Tree cover loss                                               	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/dce8004f-4d0f-4c2d-ae4b-dcf55e14035f 	|
| Tree cover loss by dominant driver                            	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/04774cb7-912c-4612-bbd8-ba982d532c88 	|
| USA forest ownership type - 2009                              	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/2978f7b2-fcdb-4fe6-bca4-7ef56b469805 	|
| WRI Oil Palm Suitability Standard                             	| tile layer 	| raster 	| https://api.resourcewatch.org/v1/layer/0aaaaec8-3279-4a75-bedb-829c6cc88f36 	|