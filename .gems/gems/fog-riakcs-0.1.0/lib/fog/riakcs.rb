require "fog/riakcs/version"
require "fog/core"

module Fog
  module RiakCS
    extend Fog::Provider

    autoload :MultipartUtils, 'fog/riakcs/multipart_utils'
    autoload :Provisioning, 'fog/riakcs/provisioning'
    autoload :Utils, 'fog/riakcs/utils'
    autoload :UserUtils, 'fog/riakcs/user_utils'
    autoload :Usage, 'fog/riakcs/usage'

    service(:provisioning, 'Provisioning')
    service(:usage,        'Usage')
  end
end
