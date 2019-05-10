class StaticController < ApplicationController
  skip_before_action :check_browser, :only => :browser_support
  respond_to :html
  respond_to :json, :only => :keepstories

  def terms
    @title = 'Terms of Service'
  end

  def privacy
    @title = 'Privacy Policy'
  end

  def browser_support
    @title = "Oops, your browser isn't supported."
  end
end
