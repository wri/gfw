class BrowserSupportController < ApplicationController
  skip_before_action :check_browser, :only => :browser_support

  layout 'application_react'
end
