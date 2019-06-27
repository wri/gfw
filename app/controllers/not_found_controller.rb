class NotFoundController < ApplicationController
  skip_before_action :check_browser, :only => :browser_support

  def index
    render :status => 404
  end

end
