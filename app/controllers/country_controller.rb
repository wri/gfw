class CountryController < ApplicationController

  layout 'country'

  def index
    @actual_path = request.original_fullpath
    @iso = params[:iso]
    @desc = 'Data about forest change, tenure, forest related employment and land use'
    @path = {
      path: @actual_path,
      iso: params[:iso]
    }
    @is_contained = @actual_path.include?('contained')
  end

  def embed
    @desc = 'Data about forest change, tenure, forest related employment and land use'
    render layout: 'country_embed'
  end

end
