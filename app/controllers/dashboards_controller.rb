class DashboardsController < ApplicationController

  layout 'application_react'
  before_action :set_title, only: [:index, :embed]

  def index
    @title = @location && @location["name"] || @location
    @desc = "Data about forest change, tenure, forest related employment and land use in #{@location}"
    if params[:widget]
      widgets_config = JSON.parse(File.read(Rails.root.join('app', 'javascript', 'components', 'widget', 'widget-config.json')))
      widget_data = widgets_config[params[:widget]]
      @og_title = "#{widget_data["title"]} in #{@location}"
      # for dynamic widget image when the feature is ready
      # @img = "widgets/#{@widget}.png"
    end
  end

  def embed
    @title = @location["name"]
    @desc = "Data about forest change, tenure, forest related employment and land use in #{@location}"
    render layout: 'application_react_embed'
  end

  private

  def set_title
    @location = params[:iso] ? Dashboards.find_by_iso(params[:iso]) : "Global Dashboard"
    p @location
  end
end
