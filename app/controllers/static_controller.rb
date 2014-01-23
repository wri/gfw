class StaticController < ApplicationController

  skip_before_filter :check_browser, :only => :old

  def old
    render :layout => "old"
  end

end