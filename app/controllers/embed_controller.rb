class EmbedController < ApplicationController
  layout 'embed'

  # GET /embed/country/:id
  def countries_show
    country = Api::Country.find_by_iso(params[:id])['countries'][0]

    not_found unless country.present?

    @country = country
  end

  def countries_show_info
    country = Api::Country.find_by_iso(params[:id])['countries'][0]

    not_found unless country.present?

    @country = country
  end

end
