require "fog/core"
require "fog/json"

# See the main fog gem for more details about the top level class {Fog}
#
# @see https://github.com/fog/fog
# @see http://fog.io/
# @see http://rubydoc.info/gems/fog
#
module Fog
  module Brightbox
    extend Fog::Provider

    service(:compute, "Compute")
    service(:storage, "Storage")

    module Compute
      autoload :Config, File.expand_path("../brightbox/compute/config", __FILE__)
      autoload :ImageSelector, File.expand_path("../brightbox/compute/image_selector", __FILE__)
      autoload :ResourceLocking, File.expand_path("../brightbox/compute/resource_locking", __FILE__)
      autoload :Shared, File.expand_path("../brightbox/compute/shared", __FILE__)
    end

    module Storage
      autoload :AuthenticationRequest, File.expand_path("../brightbox/storage/authentication_request", __FILE__)
      autoload :AuthenticationRequired, File.expand_path("../brightbox/storage/authentication_required", __FILE__)
      autoload :Connection, File.expand_path("../brightbox/storage/connection", __FILE__)
      autoload :Config, File.expand_path("../brightbox/storage/config", __FILE__)
      autoload :ManagementUrlUnknown, File.expand_path("../brightbox/storage/management_url_unknown", __FILE__)
    end

    autoload :Config, File.expand_path("../brightbox/config", __FILE__)
    autoload :LinkHelper, File.expand_path("../brightbox/link_helper", __FILE__)
    autoload :Model, File.expand_path("../brightbox/model", __FILE__)
    autoload :ModelHelper, File.expand_path("../brightbox/model_helper", __FILE__)
    autoload :OAuth2, File.expand_path("../brightbox/oauth2", __FILE__)
  end

  module Compute
    autoload :Brightbox, File.expand_path("../brightbox/compute", __FILE__)
  end

  module Storage
    autoload :Brightbox, File.expand_path("../brightbox/storage", __FILE__)
  end
end
