class CountryController < ApplicationController

  layout 'application_react'
  before_action :set_country, only: [:show, :embed]

  def show
    @title = @country && @country["name"]
    @desc = "Data about forest change, tenure, forest related employment and land use in #{@title}"
    if params[:widget]
      widgets_config = JSON.parse(File.read(Rails.root.join('app', 'javascript', 'components', 'widget', 'widget-config.json')))
      widget_data = widgets_config[params[:widget]]
      @og_title = "#{widget_data["title"]} in #{@title}"
      # for dynamic widget image when the feature is ready
      # @img = "widgets/#{@widget}.png"
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
