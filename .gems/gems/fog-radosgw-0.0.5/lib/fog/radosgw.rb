require 'fog/core'
require 'fog/json'
require 'fog/xml'

module Fog
  module Radosgw
    autoload :Provisioning, File.expand_path('../radosgw/provisioning', __FILE__)
    autoload :Usage, File.expand_path('../radosgw/usage', __FILE__)
    autoload :MultipartUtils, File.expand_path('../radosgw/multipart_utils', __FILE__)
    autoload :UserUtils, File.expand_path('../radosgw/user_utils', __FILE__)
    autoload :Utils, File.expand_path('../radosgw/utils', __FILE__)

    extend Fog::Provider

    service(:provisioning, 'Provisioning')
    service(:usage,        'Usage')
  end
end
