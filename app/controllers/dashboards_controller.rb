class DashboardsController < ApplicationController

  before_action :check_location, only: [:index, :embed]

  def index
    @title = @location_title ? "#{@location_title} | #{@title}" : @title
  end

  def embed
    @title = @location_title ? "#{@location_title} | #{@title}" : @title
    render layout: 'application_embed'
  end

end
