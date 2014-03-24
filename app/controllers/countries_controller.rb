class CountriesController < ApplicationController
  before_filter :load_countries, :only => [:index]

  # GET /country/:id
  def show
    country = Api::Country.find_by_iso(params[:id])['countries'][0]

    not_found unless country.present?

    blog_story = Api::Blog.find_by_country(country)
    @blog_story = blog_story.present? ? blog_story : nil

    response = Typhoeus.get("https://wri-01.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20mongabaydb%20WHERE%20position('#{I18n.transliterate(country['name']).downcase.gsub(" ", "_")}'%20in%20keywords)%20%3C%3E%200", headers: { "Accept" => "application/json" })
    @mongabay_story = response.success? ? JSON.parse(response.body)['rows'][0] : nil

    @country = country
  end

  private

    def load_countries
      @countries = Api::Country.all['countries']
    end

end
