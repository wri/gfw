class MapV2Controller < ApplicationController

  layout 'react'
  before_action :check_location, only: [:index, :embed]

  def index
    @title = @location_title ? "#{@location_title} | #{@title }" : @title
  end

end
