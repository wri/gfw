require "fog/core"
require "fog/xml"
require File.expand_path("../utilities", __FILE__)

module Fog
  module XenServer
    autoload :Connection, File.expand_path("../xen_server/connection", __FILE__)
    autoload :InvalidLogin, File.expand_path("../xen_server/invalid_login", __FILE__)
    autoload :NokogiriStreamParser, File.expand_path("../xen_server/nokogiri_stream_parser", __FILE__)
    autoload :NotFound, File.expand_path("../xen_server/not_found", __FILE__)
    autoload :RequestFailed, File.expand_path("../xen_server/request_failed", __FILE__)

    extend Fog::Provider

    service(:compute, "Compute")
  end

  module Compute
    autoload :XenServer, File.expand_path("../compute/xen_server", __FILE__)
  end

  module Parsers
    autoload :XenServer, File.expand_path("../parsers/xen_server", __FILE__)
  end
end
