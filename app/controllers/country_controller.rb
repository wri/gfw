class CountryController < ApplicationController

  layout 'country'

  def index
    @desc = 'Data about forest change, tenure, forest related employment and land use'
  end

  def embed
    @desc = 'Data about forest change, tenure, forest related employment and land use'
    render layout: 'country_embed'
  end

end
