module Fog
  module Compute
    class Vmfusion < Fog::Service
      autoload :Server, File.expand_path("../vmfusion/server", __FILE__)
      autoload :Servers, File.expand_path("../vmfusion/servers", __FILE__)

      model_path "fog/compute/vmfusion"

      model       :server
      collection  :servers

      class Mock
        def initialize(_options = {})
          Fog::Mock.not_implemented
        end
      end

      class Real
        def initialize(_options = {})
          require "fission"
        rescue LoadError => e
          retry if require("rubygems")
          raise e.message
        end
      end
    end
  end
end
