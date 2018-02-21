class CountryController < ApplicationController

  layout 'application_react'
  before_action :set_country, only: [:show]

  def show
    @title = @country["name"]
    @widget = params[:widget]
    @desc = "Data about forest change, tenure, forest related employment and land use in #{@title}"
    if @widget
      @img = "widgets/#{@widget}.png"
    end
  end

  def embed
    @title = @country["name"]
    @desc = "Data about forest change, tenure, forest related employment and land use in #{@title}"
    render layout: 'application_react_embed'
  end

  private

  def set_country
    @country = Country.find_by_iso(params[:iso])
  end
end
