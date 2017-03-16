#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

require 'fog/softlayer/models/compute/key_pair'

module Fog
  module Compute
    class Softlayer
      class NetworkComponents < Fog::Collection
        model Fog::Compute::Softlayer::NetworkComponent

        # just a stub

      end
    end
  end
end
