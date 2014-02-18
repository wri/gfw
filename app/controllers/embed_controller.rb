class EmbedController < ApplicationController
  layout 'iframe'

  # GET /country/:id
  def show
    country = Api::Country.find_by_iso(params[:id])['countries'][0]

    not_found unless country.present?

    @country = country
  end

end
