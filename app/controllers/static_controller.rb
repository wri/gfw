class StaticController < ApplicationController
  skip_before_filter :check_terms, :only => [:old, :terms]

  layout "old"
end