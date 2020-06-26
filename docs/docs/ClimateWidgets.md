---
id: climate_widgets
title: Climate Widget Calculations
---

## Calculating Below Ground Biomass

Used in the `carbonStock` widget, above ground biomass is calculated using the `aboveGroundToBelowGround` function, which tables above ground biomass as an input.

Here, above ground biomass can be found in the `whrc_aboveground_biomass_stock_2000__Mg` column within the _summary_ geotrellis tables, such as `998dd97a-389f-4a02-988f-17b184f507ac`.

Below ground biomass is defined as a static fraction of the total above ground biomass:

M<sub>bgb</sub> = 0.489 x M<sub>agb</sub><sup>0.89</sup>

where M<sub>bgb</sub> = belowground biomass and M<sub>agb</sub> = aboveground biomass.

Total biomass can then be calculated directly using:

M<sub>total</sub> ≈ 1.489 x M<sub>agb</sub><sup>0.89</sup>

## Calculating Carbon Stock

Carbon stock is again a derived value. Using biomass we can simply calculate carbon stock via:

M<sub>Carbon</sub> = 0.5 x M<sub>biomass</sub>