class PrivacyController < ApplicationController
  skip_before_action :check_browser, :only => :browser_support
end
