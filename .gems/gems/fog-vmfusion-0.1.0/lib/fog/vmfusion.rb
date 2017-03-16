require "fog/core"
require File.expand_path("../vmfusion/version", __FILE__)

module Fog
  module Vmfusion
    extend Fog::Provider

    service(:compute, "Compute")
  end

  module Compute
    autoload :Vmfusion, File.expand_path("../compute/vmfusion", __FILE__)
  end
end
