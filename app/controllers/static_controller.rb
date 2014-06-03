class StaticController < ApplicationController
  skip_before_filter :check_terms, :except => [:data]
  skip_before_filter :check_browser

  layout 'old', :only => [:old, :terms, :accept_terms]

  def accept_terms
    session[:return_to] = params[:return_to] unless params[:return_to].nil?
  end
end
