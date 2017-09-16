class CountryController < ApplicationController

  layout 'country'

  def index
    @title = ''
    @desc = 'Data about forest change, tenure, forest related employment and land use in ' + @title
  end

end
