class Dnsimple < Fog::Bin
  class << self
    def class_for(key)
      case key
      when :dns
        Fog::DNS::Dnsimple
      else
        raise ArgumentError, "Unrecognized service: #{key}"
      end
    end

    def [](service)
      @@connections ||= Hash.new do |hash, key|
        hash[key] = case key
        when :dns
          Fog::DNS.new(:provider => 'Dnsimple')
        else
          raise ArgumentError, "Unrecognized service: #{key.inspect}"
        end
      end
      @@connections[service]
    end

    def services
      Fog::Dnsimple.services
    end
  end
end
