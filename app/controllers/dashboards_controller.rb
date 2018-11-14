class DashboardsController < ApplicationController

  layout 'application_react'
  before_action :check_location, only: [:index, :embed]

  def index
    @title = @location_title ? "#{@location_title} | #{@title}" : @title
  end

  def embed
    @title = @location_title ? "#{@location_title} | #{@title}" : @title
    render layout: 'application_react_embed'
  end

end
