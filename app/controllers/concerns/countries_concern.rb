module CountriesConcern
  extend ActiveSupport::Concern

  module ClassMethods
    def download_link iso
      "https://wri-01.cartodb.com/api/v2/sql?q=SELECT iso as country_code,id1 as region_code, country,region, year, thresh as min_percent_canopy_density, loss as loss_ha, loss_perc as loss_percent, extent as extent_ha, extent_perc as extent_percent, gain as gain_ha, gain_perc as gain_percent from umd_subnat where iso='#{iso}'&format=csv&filename='#{iso}'"
    end
  end
end
