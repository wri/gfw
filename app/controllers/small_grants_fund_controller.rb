class SmallGrantsFundController < ApplicationController

  if ENV['FEATURE_ENV'] == 'staging'
    layout 'application_react'
  else
    layout 'application'
  end

  def index
    @title = 'Small Grants Fund'
  end

end
