class StaticController < ApplicationController
  skip_before_action :check_browser, :only => :browser_support
  respond_to :html
  respond_to :json, :only => :keepstories

  layout 'application_react_spa'

  def terms
    @title = 'Terms of Service'
    @desc = 'Welcome to the WRI family of environmental data platforms. By using the Services, you agree to be bound by these Terms of Service and any future updates.'
    @keywords = 'terms of service, wri, world resources institute, data, global forest watch, data platform, services, terms, forest watcher'
  end

  def privacy
    @title = 'Privacy Policy'
    @desc = 'This Privacy Policy tells you how WRI handles information collected about you through our websites and applications.'
    @keywords = 'terms of service, wri, world resources institute, data, global forest watch, data platform, services, terms, forest watcher'
  end

  def browser_support
    @title = "Browser Not Supported"
    @desc = "Oops, your browser isn’t supported. Please upgrade to a supported browser and try loading the website again."
  end
end
