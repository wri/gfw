class StaticController < ApplicationController
  skip_before_filter :check_terms, :except => [:data]

  layout 'old', :only => [:old, :terms, :accept_terms]
end