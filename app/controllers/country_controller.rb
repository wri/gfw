class CountryController < ApplicationController

  layout 'country'
  before_action :set_country, only: [:show]

  def show
    @actual_path = request.original_fullpath
    @iso = @country["iso"]
    @title = @country["name"]
    @desc = 'Data about forest change, tenure, forest related employment and land use'
    @is_contained = @actual_path.include?('contained')
  end

  def embed
    @desc = 'Data about forest change, tenure, forest related employment and land use'
    render layout: 'country_embed'
  end

  private

  def set_country
    @country = Country.find_by_iso(params[:iso])
  end
end
