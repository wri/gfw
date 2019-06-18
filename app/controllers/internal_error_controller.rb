class InternalErrorController < ApplicationController
  skip_before_action :check_browser, :only => :browser_support

  def index
    render :status => 500
  end

end
