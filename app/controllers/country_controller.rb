class CountryController < ApplicationController

  layout 'application_react'
  before_action :set_country, only: [:show]

  def show
    @iso = @country["iso"]
    @title = @country["name"]
    @desc = "Data about forest change, tenure, forest related employment and land use #{@title}"
  end

  def embed
    @title = 'Widget Embed'
    @desc = "Data about forest change, tenure, forest related employment and land use #{@title}"
    render layout: 'application_react_embed'
  end

  private

  def set_country
    @country = Country.find_by_iso(params[:iso])
  end
end
