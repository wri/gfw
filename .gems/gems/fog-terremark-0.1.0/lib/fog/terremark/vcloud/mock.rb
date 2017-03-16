module Fog
  module Terremark
    class Vcloud
      class Mock < Fog::Compute::Terremark::Mock
        def initialize(option = {})
          super
          @base_url = Fog::Terremark::Vcloud::SCHEME + "://" +
              Fog::Terremark::Vcloud::HOST +
              Fog::Terremark::Vcloud::PATH

          @terremark_username = options[:terremark_vcloud_username]
        end

        def data
          self.class.data[@terremark_username]
        end

        def reset_data
          self.class.data.delete(@terremark_username)
        end
      end
    end
  end
end
