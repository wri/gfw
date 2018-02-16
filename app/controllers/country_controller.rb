class CountryController < ApplicationController

  layout 'country'

  def index
    @desc = 'Data about forest change, tenure, forest related employment and land use'
    @actual_path = request.original_fullpath
    @is_contained = @actual_path.include?('contained')
  end

  def embed
    @desc = 'Data about forest change, tenure, forest related employment and land use'
    render layout: 'country_embed'
  end

end
