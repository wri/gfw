module Paths
  def root_path
    '/'
  end

  def country_path
    '/countries/1'
  end

  def map_path
    '/map'
  end
end

RSpec.configure {|config| config.include Paths}
