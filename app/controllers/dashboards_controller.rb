class DashboardsController < ApplicationController

  layout 'application_react'
  before_action :check_location, only: [:index, :embed]

  def index
    @desc = "Data about forest change, tenure, forest related employment and land use in #{@title}"
    # if params[:widget]
    #   widgets_config = JSON.parse(File.read(Rails.root.join('app', 'javascript', 'components', 'widget', 'widget-config.json')))
    #   widget_data = widgets_config[params[:widget]]
    #   @og_title = "#{widget_data["title"]} in #{@location}"
    #   # for dynamic widget image when the feature is ready
    #   # @img = "widgets/#{@widget}.png"
    # end
  end

  def embed
    @desc = "Data about forest change, tenure, forest related employment and land use in #{@title}"
    render layout: 'application_react_embed'
  end

  private

  def check_location
    if !params[:iso] && params[:type] != 'global'
      redirect_to action: "index", type: 'global'
    elsif params[:iso]
      if params[:sub_region]
        @location = Dashboards.find_adm2_by_iso_id(params[:iso], params[:region], params[:sub_region])
      elsif params[:region]
        @location = Dashboards.find_adm1_by_iso_id(params[:iso], params[:region])
      else
        @location = Dashboards.find_country_by_iso(params[:iso])
      end
      if !@location
        redirect_to action: "index", type: 'global'
      end
    end
    set_title
  end

  def set_title
    if !@location
      @title = "#{params[:type] && params[:type].capitalize || 'Global'} Dashboard"
    else
      if params[:sub_region]
        @title = "#{@location['adm2']}, #{@location['adm1']}, #{@location['name']}"
      elsif params[:region]
        @title = "#{@location['adm1']}, #{@location['name']}"
      elsif params[:iso]
        @title = "#{@location['name']}"
      else
        @title = "#{params[:type] && params[:type].capitalize || 'Global'} Dashboard"
      end
    end
  end

end
