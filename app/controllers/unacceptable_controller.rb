class UnacceptableController < ApplicationController

  def index
    render :status => 422
  end

end
