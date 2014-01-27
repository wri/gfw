class CountriesController < ApplicationController

  before_filter :load_countries, :only => [:index, :overview]

  # GET /country/:id
  def show
    country = Api::Country.find_by_iso(params[:id])['countries'][0]

    not_found unless country.present?

    @blog_story = Api::Blog.find_post_by_country(country['name'].downcase.gsub(" ", "_"))
    @mongabay_story = HTTParty.get("https://wri-01.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20mongabaydb%20WHERE%20position('#{I18n.transliterate(country['name']).downcase.gsub(" ", "_")}'%20in%20keywords)%20%3C%3E%200")['rows']

    @country = country
  end

  private

    def load_countries
      @countries = Api::Country.all['countries']
    end

end
