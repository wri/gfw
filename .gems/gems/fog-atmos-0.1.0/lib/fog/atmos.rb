require 'fog/atmos/version'
require 'fog/core'
require 'fog/xml'

module Fog
  module Atmos
    extend Fog::Provider

    service(:storage, 'Storage')
  end

  module Storage
    autoload :Atmos, 'fog/storage/atmos'
  end
end
