require "fog/core"
require "fog/xml"
require File.expand_path("../terremark/version", __FILE__)

module Fog
  module Terremark
    autoload :Vcloud, File.expand_path("../terremark/vcloud", __FILE__)
  end

  module Compute
    autoload :Terremark, File.expand_path("../compute/terremark", __FILE__)
  end

  module Parsers
    autoload :Terremark, File.expand_path("../parsers/terremark", __FILE__)
  end
end
