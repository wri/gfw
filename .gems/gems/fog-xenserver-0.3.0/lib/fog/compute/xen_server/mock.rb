module Fog
  module Compute
    class XenServer
      class Mock
        def self.data
          @data ||= Hash.new do |hash, key|
            hash[key] = {}
          end
        end

        def self.reset_data(keys=data.keys)
          for key in [*keys]
            data.delete(key)
          end
        end

        def initialize(options={})
          @host        = options[:xenserver_pool_master]
          @username    = options[:xenserver_username]
          @password    = options[:xenserver_password]
          @connection  = Fog::XML::Connection.new(@host)
          @connection.authenticate(@username, @password)
        end

        def method_missing(method_name, *args)
          Fog::Mock.not_implemented
        end
      end
    end
  end
end