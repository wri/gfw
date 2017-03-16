#
# Author:: Matheus Francisco Barra Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

class Softlayer
  module Network
    module Formats
      module Datacenter
        DATACENTER = {
            "id" => Integer,
            "long_name" => String,
            "name" => String
        }
      end
    end
  end
end
