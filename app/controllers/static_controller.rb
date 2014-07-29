class StaticController < ApplicationController
  skip_before_filter :check_terms, :except => [:data]
  skip_before_filter :check_browser

  def terms
    @title = 'Terms of Service'
  end
end
