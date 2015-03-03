class RobotsController < ApplicationController
  layout false

  def index
    if canonical_host?
      render 'allow'
    else
      render 'disallow'
    end
  end

  private

  def canonical_host?
    request.host =~ /www\.globalforestwatch\.org/
  end
end
