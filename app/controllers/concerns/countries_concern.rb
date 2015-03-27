module CountriesConcern
  extend ActiveSupport::Concern

  def download_link iso
    "http://gfw2-data.s3.amazonaws.com/country/umd_country_stats/umd_country_stats.xlsx"
  end
end
