require "fog/core"
require "fog/json"
require File.expand_path("../storm_on_demand/version", __FILE__)

module Fog
  module StormOnDemand
    autoload :Shared, File.expand_path("../storm_on_demand/shared", __FILE__)

    extend Fog::Provider

    service(:compute, "Compute")
    service(:network, "Network")
    service(:storage, "Storage")
    service(:dns, "DNS")
    service(:billing, "Billing")
    service(:monitoring, "Monitoring")
    service(:support, "Support")
    service(:models, "Account")
    service(:vpn, "VPN")
  end

  module Account
    autoload :StormOnDemand, File.expand_path("../account/storm_on_demand", __FILE__)
  end

  module Billing
    autoload :StormOnDemand, File.expand_path("../billing/storm_on_demand", __FILE__)
  end

  module Compute
    autoload :StormOnDemand, File.expand_path("../compute/storm_on_demand", __FILE__)
  end

  module DNS
    autoload :StormOnDemand, File.expand_path("../dns/storm_on_demand", __FILE__)
  end

  module Monitoring
    autoload :StormOnDemand, File.expand_path("../monitoring/storm_on_demand", __FILE__)
  end

  module Network
    autoload :StormOnDemand, File.expand_path("../network/storm_on_demand", __FILE__)
  end

  module Storage
    autoload :StormOnDemand, File.expand_path("../storage/storm_on_demand", __FILE__)
  end

  module Support
    autoload :StormOnDemand, File.expand_path("../support/storm_on_demand", __FILE__)
  end

  module VPN
    autoload :StormOnDemand, File.expand_path("../vpn/storm_on_demand", __FILE__)
  end
end
