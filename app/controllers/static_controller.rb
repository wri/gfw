class StaticController < ApplicationController
  skip_before_filter :check_terms, :except => [:data]
  skip_before_filter :check_browser

  def terms
    @title = 'Terms of Service'
  end

  def about
    @title = I18n.translate 'static.about.title'
  end

  def data
    @title = 'Data'
  end

  def howto
    @title = 'How to'
  end

  def keep
    @title = 'Keep Updated'
  end

  def getinvolved
    @title = 'Get Involved'
  end

  def coming
    @title = 'Coming soon'
  end

end
