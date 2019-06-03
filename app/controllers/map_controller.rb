class MapController < ApplicationController

  before_action :check_location, only: [:index, :embed]
  layout 'application_react'

  def index
    @title = @location_title ? "#{@location_title} | #{@title }" : @title
  end

end
