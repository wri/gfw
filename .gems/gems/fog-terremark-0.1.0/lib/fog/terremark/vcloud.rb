module Fog
  module Terremark
    class Vcloud < Fog::Compute::Terremark
      autoload :Mock, File.expand_path("../vcloud/mock", __FILE__)
      autoload :Real, File.expand_path("../vcloud/real", __FILE__)

      HOST   = "services.vcloudexpress.terremark.com"
      PATH   = "/api/v0.8a-ext1.6"
      PORT   = 443
      SCHEME = "https"

      def self.new(options = {})
        Fog::Logger.deprecation("Fog::Terremark::Vcloud is deprecated, to be replaced with Vcloud 1.0 someday/maybe [light_black](#{caller.first})[/]")
        super
      end

      def default_ssh_key
        if default_ssh_key
          @default_ssh_key ||= begin
            keys = get_keys_list(default_organization_id).body["Keys"]
            keys.find { |item| item["IsDefault"] == "true" }
          end
        end
      end
    end
  end
end
