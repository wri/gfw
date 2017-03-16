class SakuraCloud < Fog::Bin
  class << self
    def class_for(key)
      case key
      when :compute
        Fog::Compute::SakuraCloud
      when :volume
        Fog::Volume::SakuraCloud
      when :network
        Fog::Network::SakuraCloud
      else
        raise ArgumentError, "Unrecognized service: #{key}"
      end
    end

    def [](service)
      @@connections ||= Hash.new do |hash, key|
        hash[key] = case key
        when :compute
          Fog::Logger.warning("SakuraCloud[:compute] is not recommended, use Fog::Compute[:sakuracloud] for portability")
          Fog::Compute.new(:provider => 'SakuraCloud')
        when :volume
          Fog::Logger.warning("SakuraCloud[:volume] is not recommended, use Fog::Volume[:sakuracloud] for portability")
          Fog::Volume.new(:provider => 'SakuraCloud')
        when :network
          Fog::Logger.warning("SakuraCloud[:network] is not recommended, use Fog::Network[:sakuracloud] for portability")
          Fog::Network.new(:provider => 'SakuraCloud')
        else
          raise ArgumentError, "Unrecognized service: #{key.inspect}"
        end
      end
      @@connections[service]
    end

    def services
      Fog::SakuraCloud.services
    end
  end
end
