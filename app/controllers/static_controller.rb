class StaticController < ApplicationController

  skip_before_filter :check_terms, :only => [:old, :terms]

  def old
    render :layout => "old"
  end

  def terms
    render :layout => "old"
  end

end