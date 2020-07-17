---
id: climate_widgets
title: Climate Widget Calculations
---

## Calculating Below Ground Biomass

Used in the `carbonStock` widget, above ground biomass is calculated using the `agBiomass2bgBiomass` function, which tables above ground biomass as an input.

Here, above ground biomass can be found in the `whrc_aboveground_biomass_stock_2000__Mg` column within the _summary_ geotrellis tables, such as `998dd97a-389f-4a02-988f-17b184f507ac`.

Below ground biomass is defined as a static fraction of the total above ground biomass:

M<sub>bgb</sub> = 0.489 x M<sub>agb</sub><sup>0.89</sup>

where M<sub>bgb</sub> = belowground biomass and M<sub>agb</sub> = aboveground biomass.

Total biomass can then be calculated directly using:

M<sub>total</sub> = M<sub>agb</sub> + M<sub>bgb</sub> =  M<sub>agb</sub> + (0.489 x M<sub>agb</sub><sup>0.89</sup>)

To do the latter in one step we have available the `agBiomass2TotalBiomass` function.

## Calculating Carbon Stocks

Carbon stock is again a derived value. In general, we can calculate a carbon stock value using it's biomass equivalent using:

M<sub>Carbon</sub> = 0.5 x M<sub>biomass</sub>

However, when calculating the various derived values like *Below Ground Carbon*, or *Total Carbon Stock*, it's important to notice that there are two divergent methods for arriving at the desired value.

While mathematically you can go from *Above Ground Biomass* to *Below Ground Carbon* via either of the following routes:

 - AGB -> BGB -> BGC 
 - AGB -> AGC -> BGC
  
they actually give slightly different results computationally due to rounding errors which incrase with the startiing values. The biologically correct way to get from *Above Ground Biomass* to *Below Ground Carbon* is to do the former: AGB -> BGB -> BGC. 

Therefre, so that we are consistent, we have the following functions defined:

- `agBiomass2bgCarbon`, where:

M<sub>bgc</sub> = 0.5 * M<sub>bgb</sub> = 0.5 * (0.489 x M<sub>agb</sub><sup>0.89</sup>)

- `agBiomass2TotalCarbon`, where:

M<sub>carbon</sub> = M<sub>agc</sub> + M<sub>bgc</sub> = (0.5 * M<sub>agb</sub>) + (0.5 * M<sub>bgb</sub> = 0.5 * (0.489 x M<sub>agb</sub><sup>0.89</sup>))

