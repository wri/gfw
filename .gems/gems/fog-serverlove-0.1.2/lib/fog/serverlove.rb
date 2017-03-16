require "fog/core"
require "fog/json"
require File.expand_path("../serverlove/version", __FILE__)

module Fog
  module Compute
    autoload :Serverlove, File.expand_path("../compute/serverlove", __FILE__)
  end

  module Serverlove
    extend Fog::Provider

    service(:compute, "Compute")
  end
end
